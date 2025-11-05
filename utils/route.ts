import { point, lineString } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { Coordinates, RouteData, AutocompletePrediction, PlaceResult } from '../types';
import { decodePolyline } from './polyline';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Calculate progress along a route based on current position
 */
export function calculateRouteProgress(
  currentPosition: Coordinates,
  routeData: RouteData
): {
  progress: number; // 0-100
  distanceTraveled: number; // meters
  distanceRemaining: number; // kilometers
  isOffRoute: boolean;
  distanceFromRoute: number; // meters
} {
  const { decodedPath, totalDistance } = routeData;

  // Get the destination (last point in the route)
  const destination = decodedPath[decodedPath.length - 1];

  // Simple Haversine distance calculation to destination
  const R = 6371000; // Earth's radius in meters
  const φ1 = (currentPosition.lat * Math.PI) / 180;
  const φ2 = (destination.lat * Math.PI) / 180;
  const Δφ = ((destination.lat - currentPosition.lat) * Math.PI) / 180;
  const Δλ = ((destination.lng - currentPosition.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistanceToDestination = R * c; // in meters

  console.log('🎯 [calculateRouteProgress] Distance check:', {
    currentPos: `${currentPosition.lat.toFixed(6)}, ${currentPosition.lng.toFixed(6)}`,
    routeEndpoint: `${destination.lat.toFixed(6)}, ${destination.lng.toFixed(6)}`,
    directDistance: `${directDistanceToDestination.toFixed(1)} meters`,
    willReturnAsArrived: directDistanceToDestination < 50,
  });

  // If we're within 50 meters of the actual destination, consider us at destination
  const DESTINATION_PROXIMITY_THRESHOLD = 50; // meters
  if (directDistanceToDestination < DESTINATION_PROXIMITY_THRESHOLD) {
    return {
      progress: 100,
      distanceTraveled: totalDistance,
      distanceRemaining: 0,
      isOffRoute: false,
      distanceFromRoute: 0,
    };
  }

  // Convert route to GeoJSON LineString
  const line = lineString(decodedPath.map((coord) => [coord.lng, coord.lat]));

  // Find nearest point on route to current position
  const currentPoint = point([currentPosition.lng, currentPosition.lat]);
  const snapped = nearestPointOnLine(line, currentPoint);

  // Distance from route (in kilometers, convert to meters)
  const distanceFromRoute = snapped.properties.dist! * 1000;

  // Determine if user is off route (more than 50 meters away)
  const OFF_ROUTE_THRESHOLD = 50; // meters
  const isOffRoute = distanceFromRoute > OFF_ROUTE_THRESHOLD;

  // Distance traveled along route (in kilometers, convert to meters)
  const distanceTraveled = snapped.properties.location! * 1000;

  // Calculate remaining distance
  const distanceRemaining = (totalDistance - distanceTraveled) / 1000; // Convert to km

  // Calculate progress percentage
  const progress = Math.min(Math.max((distanceTraveled / totalDistance) * 100, 0), 100);

  // If remaining distance is very small (< 100 meters), consider it as 0
  const DESTINATION_THRESHOLD_KM = 0.1; // 100 meters
  const adjustedDistanceRemaining =
    distanceRemaining < DESTINATION_THRESHOLD_KM ? 0 : distanceRemaining;

  return {
    progress,
    distanceTraveled,
    distanceRemaining: Math.max(adjustedDistanceRemaining, 0),
    isOffRoute,
    distanceFromRoute,
  };
}

/**
 * Fetch route from Google Maps Directions API
 */
export async function fetchRoute(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteData | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      console.error('No route found:', data.status);
      return null;
    }

    const route = data.routes[0];
    const leg = route.legs[0];
    const polylineEncoded = route.overview_polyline.points;

    return {
      polyline: polylineEncoded,
      decodedPath: decodePolyline(polylineEncoded),
      totalDistance: leg.distance.value,
      duration: leg.duration.value,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(coords: Coordinates): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results[0]) {
      const address = data.results[0].formatted_address;
      // Extract just the city/area if possible (remove country, full details)
      const shortAddress = address.split(',').slice(0, 2).join(',');
      return shortAddress || address;
    }

    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

/**
 * Fetch autocomplete predictions from Google Places API
 */
export async function fetchAutocompletePredictions(
  input: string
): Promise<AutocompletePrediction[]> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.predictions) {
      return data.predictions;
    }

    return [];
  } catch (error) {
    console.error('Error fetching autocomplete predictions:', error);
    return [];
  }
}

/**
 * Get place details from place ID
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      return data.result;
    }

    return null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}
