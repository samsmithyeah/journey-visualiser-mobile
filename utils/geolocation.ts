import * as Location from 'expo-location';

/**
 * Check and request location permissions
 * @returns Promise resolving to permission status
 */
export async function checkLocationPermission(): Promise<'granted' | 'denied' | null> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      return 'granted';
    }
    if (status === 'denied') {
      return 'denied';
    }
    return null;
  } catch (error) {
    console.warn('Could not check location permission:', error);
    return null;
  }
}

/**
 * Request location permissions
 * @returns Promise resolving to permission status
 */
export async function requestLocationPermission(): Promise<'granted' | 'denied'> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted' ? 'granted' : 'denied';
  } catch (error) {
    console.warn('Could not request location permission:', error);
    return 'denied';
  }
}

/**
 * Get human-readable error message from location error
 * @param error Error
 * @returns User-friendly error message
 */
export function getGeolocationErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message;
    if (message.includes('permission')) {
      return 'Location permission denied. Please enable location access and try again.';
    }
    if (message.includes('unavailable')) {
      return 'Location unavailable. Please check your device settings and ensure location services are enabled.';
    }
    if (message.includes('timeout')) {
      return 'Location request timed out. Please try again.';
    }
    return message;
  }
  return 'Unknown location error';
}
