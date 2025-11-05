# Are We Nearly There? - Mobile App

A React Native/Expo mobile app for tracking journey progress in real-time with a fun, kid-friendly interface.

## Features

- 🗺️ Real-time journey tracking with GPS
- 🎯 Google Places autocomplete for destination search
- 📍 Live progress visualization
- 🎉 Celebration animation when reaching destination
- 🐛 Debug panel for testing (development mode only)
- 🎨 Colorful, child-friendly UI

## Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo account (sign up at https://expo.dev)
- For iOS: Mac with Xcode
- For Android: Android Studio or Android SDK

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:
   - Update the `.env` file with your Google Maps API key
   - Make sure the following APIs are enabled in Google Cloud Console:
     - Maps JavaScript API
     - Places API
     - Directions API
     - Geocoding API

3. Build and run the development build:

   **For iOS Simulator:**

   ```bash
   npx expo run:ios
   ```

   **For Android Emulator:**

   ```bash
   npx expo run:android
   ```

   This will build the native app and start the development server.

   See `DEV_BUILD_INSTRUCTIONS.md` for detailed build instructions for physical devices.

## Project Structure

```
journey-visualiser-mobile/
├── App.tsx                 # Main app component
├── components/             # React components
│   ├── DestinationSearch.tsx
│   ├── JourneyVisualizer.tsx
│   ├── JourneyInfo.tsx
│   ├── ErrorDisplay.tsx
│   ├── StopJourneyModal.tsx
│   ├── DestinationCelebration.tsx
│   ├── DebugPanel.tsx
│   └── debug/             # Debug-specific components
├── hooks/                 # Custom React hooks
│   └── useJourneyTracking.ts
├── utils/                 # Utility functions
│   ├── route.ts          # Google Maps API integration
│   ├── polyline.ts       # Polyline decoding
│   └── geolocation.ts    # Location permissions
├── types/                 # TypeScript type definitions
│   └── index.ts
├── constants/             # App constants
│   └── index.ts
└── assets/               # Images and fonts

```

## Development

### Testing Location Features

The app includes a debug panel (only visible in development mode) that allows you to:

- Set mock GPS coordinates
- Simulate journey progress
- Quick-jump to origin, halfway point, or destination

To access the debug panel:

1. Start a journey
2. Look for the "Debug mode" button (bottom-right corner)
3. Tap to open the debug controls

### Testing on Physical Device

For best results, test location tracking on a physical device rather than a simulator:

- iOS: Use Expo Go from the App Store
- Android: Use Expo Go from the Play Store

## Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Location** - Geolocation services
- **Google Maps APIs** - Routing and places
- **Turf.js** - Geospatial calculations
- **Lucide React Native** - Icons
- **Nunito Font** - Typography

## API Keys

This app requires a Google Maps API key with the following APIs enabled:

- Maps JavaScript API
- Places API
- Directions API
- Geocoding API

## License

See LICENSE file for details.
