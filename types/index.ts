// Core coordinate interface used throughout the app
export interface Coordinates {
  lat: number;
  lng: number;
}

// Route data from API
export interface RouteData {
  polyline: string; // Encoded polyline
  decodedPath: Coordinates[]; // Decoded coordinates
  totalDistance: number; // meters
  duration: number; // seconds
}

// Journey state management
export interface JourneyState {
  origin: Coordinates | null;
  destination: Coordinates | null;
  currentPosition: Coordinates | null;
  progress: number;
  totalDistance: number | null;
  remainingDistance: number | null;
  isTracking: boolean;
  error: string | null;
  routeData: RouteData | null;
  isOffRoute: boolean;
  hasReachedDestination: boolean;
}

// Google Maps autocomplete prediction
export interface Prediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

// Google Places API raw autocomplete prediction
export interface AutocompletePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text?: string;
  };
}

// Google Place result
export interface PlaceResult {
  name?: string;
  formatted_address?: string;
  place_id?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}
