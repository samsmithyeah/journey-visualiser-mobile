import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { Coordinates, JourneyState } from '../types';
import { fetchRoute, calculateRouteProgress } from '../utils/route';
import {
  checkLocationPermission,
  requestLocationPermission,
  getGeolocationErrorMessage,
} from '../utils/geolocation';
import { ERROR_THRESHOLDS, SIMULATION_CONFIG } from '../constants';

export function useJourneyTracking() {
  const [journeyState, setJourneyState] = useState<JourneyState>({
    origin: null,
    destination: null,
    currentPosition: null,
    progress: 0,
    totalDistance: null,
    remainingDistance: null,
    isTracking: false,
    error: null,
    routeData: null,
    isOffRoute: false,
    hasReachedDestination: false,
  });

  const [mockLocation, setMockLocation] = useState<Coordinates | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const errorCountRef = useRef(0);
  const lastRouteRefetchRef = useRef<number>(0);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // Set destination and start tracking
  const startJourney = useCallback(
    async (destinationCoords: Coordinates): Promise<Coordinates | null> => {
      // Check for location permission first
      let permissionState = await checkLocationPermission();

      if (permissionState === 'denied') {
        setJourneyState((prev) => ({
          ...prev,
          error:
            'Location permission denied. Please enable location access in your device settings.',
        }));
        return null;
      }

      if (permissionState === null) {
        // Request permission
        permissionState = await requestLocationPermission();
        if (permissionState === 'denied') {
          setJourneyState((prev) => ({
            ...prev,
            error:
              'Location permission denied. Please enable location access in your device settings.',
          }));
          return null;
        }
      }

      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const origin: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log('🚀 [startJourney] Fetching initial route...');
        // Fetch route from API
        const routeData = await fetchRoute(origin, destinationCoords);

        if (!routeData) {
          setJourneyState((prev) => ({
            ...prev,
            error: 'Failed to calculate route. Please try again.',
          }));
          return null;
        }

        console.log('✅ [startJourney] Route fetched:', {
          distance: (routeData.totalDistance / 1000).toFixed(2) + ' km',
          points: routeData.decodedPath.length,
        });

        setJourneyState((prev) => ({
          ...prev,
          origin,
          destination: destinationCoords,
          currentPosition: origin,
          totalDistance: routeData.totalDistance / 1000, // Convert to km for display
          routeData,
          isTracking: true,
          error: null,
          isOffRoute: false,
        }));

        return origin;
      } catch (error: unknown) {
        const errorMessage = getGeolocationErrorMessage(error);
        setJourneyState((prev) => ({ ...prev, error: errorMessage }));
        return null;
      }
    },
    []
  );

  // Re-fetch route when user goes off-route
  const refetchRoute = useCallback(
    async (origin: Coordinates, destination: Coordinates, force = false) => {
      const now = Date.now();
      const timeSinceLastRefetch = now - lastRouteRefetchRef.current;

      // Throttle re-fetches to max once per 30 seconds (unless forced)
      if (!force && timeSinceLastRefetch < 30000) {
        console.log('⏱️ [refetchRoute] Throttled - waiting before re-fetching');
        return null;
      }

      console.log('🔄 [refetchRoute] User off route, fetching new route from original origin...');
      lastRouteRefetchRef.current = now;

      // Fetch route from ORIGINAL origin to destination (not current position)
      const newRoute = await fetchRoute(origin, destination);

      if (newRoute) {
        console.log('✅ [refetchRoute] New route fetched (keeping original origin)');
        setJourneyState((prev) => ({
          ...prev,
          routeData: newRoute,
          totalDistance: newRoute.totalDistance / 1000,
          isOffRoute: false,
        }));
      }

      return newRoute;
    },
    []
  );

  // Update current position and calculate progress
  useEffect(() => {
    if (!journeyState.isTracking || !journeyState.destination || !journeyState.routeData) {
      return;
    }

    // If using mock location, calculate progress
    if (mockLocation) {
      const progressData = calculateRouteProgress(mockLocation, journeyState.routeData);

      console.log('📍 [mockLocation] Progress update:', {
        progress: progressData.progress.toFixed(1) + '%',
        remaining: progressData.distanceRemaining.toFixed(3) + ' km',
        willTriggerCelebration:
          progressData.progress >= 99.5 || progressData.distanceRemaining < 0.05,
      });

      setJourneyState((prev) => {
        // Check if destination is reached (progress >= 99.5% or remaining distance < 50 meters)
        const destinationReached =
          !prev.hasReachedDestination &&
          (progressData.progress >= 99.5 || progressData.distanceRemaining < 0.05);

        if (destinationReached) {
          console.log('🎉 [mockLocation] DESTINATION REACHED!');
        }

        return {
          ...prev,
          currentPosition: mockLocation,
          progress: progressData.progress,
          remainingDistance: progressData.distanceRemaining,
          isOffRoute: progressData.isOffRoute,
          hasReachedDestination: destinationReached || prev.hasReachedDestination,
        };
      });

      // If off route, refetch
      if (progressData.isOffRoute && journeyState.destination && journeyState.origin) {
        refetchRoute(journeyState.origin, journeyState.destination);
      }

      return;
    }

    // Watch position with high accuracy
    const startWatchingPosition = async () => {
      try {
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // update every 1 second
            distanceInterval: 5, // update every 5 meters
          },
          (position) => {
            // Reset error count on successful position update
            errorCountRef.current = 0;

            const currentPos: Coordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // Calculate progress using the route polyline (no API call!)
            const progressData = calculateRouteProgress(currentPos, journeyState.routeData!);

            console.log('📍 [watchPosition] Progress:', {
              progress: progressData.progress.toFixed(1) + '%',
              remaining: progressData.distanceRemaining.toFixed(2) + ' km',
              offRoute: progressData.isOffRoute,
              distanceFromRoute: progressData.distanceFromRoute.toFixed(1) + ' m',
            });

            setJourneyState((prev) => {
              // Check if destination is reached (progress >= 99.5% or remaining distance < 50 meters)
              const destinationReached =
                !prev.hasReachedDestination &&
                (progressData.progress >= 99.5 || progressData.distanceRemaining < 0.05);

              return {
                ...prev,
                currentPosition: currentPos,
                progress: progressData.progress,
                remainingDistance: progressData.distanceRemaining,
                isOffRoute: progressData.isOffRoute,
                error: null, // Clear any previous errors
                hasReachedDestination: destinationReached || prev.hasReachedDestination,
              };
            });

            // If user is off route, refetch a new route
            if (progressData.isOffRoute && journeyState.destination && journeyState.origin) {
              console.log('⚠️ [watchPosition] User is off route!');
              refetchRoute(journeyState.origin, journeyState.destination);
            }
          }
        );

        locationSubscriptionRef.current = subscription;
      } catch (error: unknown) {
        errorCountRef.current++;

        const errorMessage = getGeolocationErrorMessage(error);

        // Only log every nth error to avoid console spam
        if (errorCountRef.current % ERROR_THRESHOLDS.LOG_FREQUENCY === 1) {
          console.warn(`GPS position error (${errorCountRef.current} errors):`, errorMessage);
          console.log(
            'Tip: GPS errors are common indoors or with poor sky visibility. The app will keep trying.'
          );
        }

        // Only show error to user after many consecutive failures
        if (errorCountRef.current > ERROR_THRESHOLDS.DISPLAY_THRESHOLD) {
          setJourneyState((prev) => ({
            ...prev,
            error:
              'Having trouble getting GPS signal. Please ensure you have a clear view of the sky.',
          }));
        }
      }
    };

    startWatchingPosition();

    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }
    };
  }, [
    journeyState.isTracking,
    journeyState.destination,
    journeyState.origin,
    journeyState.routeData,
    mockLocation,
    refetchRoute,
  ]);

  const stopJourney = useCallback(() => {
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
    }

    setJourneyState({
      origin: null,
      destination: null,
      currentPosition: null,
      progress: 0,
      totalDistance: null,
      remainingDistance: null,
      isTracking: false,
      error: null,
      routeData: null,
      isOffRoute: false,
      hasReachedDestination: false,
    });
    setMockLocation(null);
    setIsSimulating(false);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    lastRouteRefetchRef.current = 0;
  }, [simulationInterval]);

  // Set mock location for testing
  const setMockPosition = useCallback(
    async (lat: number, lng: number) => {
      const newPosition = { lat, lng };
      setMockLocation(newPosition);

      // Force immediate route re-fetch when manually setting position
      if (journeyState.destination && journeyState.origin && journeyState.routeData) {
        const progressData = calculateRouteProgress(newPosition, journeyState.routeData);
        if (progressData.isOffRoute) {
          console.log('🎯 [setMockPosition] Position is off-route, forcing route re-fetch...');
          await refetchRoute(journeyState.origin, journeyState.destination, true);
        }
      }
    },
    [journeyState.destination, journeyState.origin, journeyState.routeData, refetchRoute]
  );

  // Simulate journey by gradually moving from origin to destination
  const simulateJourney = useCallback(() => {
    if (!journeyState.origin || !journeyState.destination) return;

    if (isSimulating) {
      // Stop simulation
      setIsSimulating(false);
      if (simulationInterval) {
        clearInterval(simulationInterval);
        setSimulationInterval(null);
      }
      return;
    }

    // Start simulation
    setIsSimulating(true);
    let step = 0;

    const interval = setInterval(() => {
      if (!journeyState.origin || !journeyState.destination) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationInterval(null);
        return;
      }

      step++;
      const progress = step / SIMULATION_CONFIG.TOTAL_STEPS;

      // Interpolate between origin and destination
      const currentLat =
        journeyState.origin.lat +
        (journeyState.destination.lat - journeyState.origin.lat) * progress;
      const currentLng =
        journeyState.origin.lng +
        (journeyState.destination.lng - journeyState.origin.lng) * progress;

      setMockLocation({ lat: currentLat, lng: currentLng });

      if (step >= SIMULATION_CONFIG.TOTAL_STEPS) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationInterval(null);
      }
    }, SIMULATION_CONFIG.UPDATE_INTERVAL);

    setSimulationInterval(interval);
  }, [journeyState.origin, journeyState.destination, isSimulating, simulationInterval]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  return {
    ...journeyState,
    startJourney,
    stopJourney,
    setMockPosition,
    simulateJourney,
    isSimulating,
  };
}
