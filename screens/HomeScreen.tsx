import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import {
  DebugPanel,
  DestinationCelebration,
  DestinationSearch,
  ErrorDisplay,
  JourneyDetailsSheet,
  JourneyInfo,
  JourneyVisualizer,
  StopJourneyModal,
} from '../components';
import { useJourneyTracking } from '../hooks';
import { reverseGeocode } from '../utils';
import { PlaceResult } from '../types';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const [destinationName, setDestinationName] = useState<string>('');
  const [originName, setOriginName] = useState<string>('Current Location');
  const [showStopModal, setShowStopModal] = useState<boolean>(false);
  const [showDetailsSheet, setShowDetailsSheet] = useState<boolean>(false);
  const [celebrationDismissed, setCelebrationDismissed] = useState<boolean>(false);
  const { width } = useWindowDimensions();

  const {
    progress,
    isTracking,
    startJourney,
    stopJourney,
    error,
    remainingDistance,
    origin,
    destination,
    currentPosition,
    setMockPosition,
    simulateJourney,
    isSimulating,
    hasReachedDestination,
  } = useJourneyTracking();

  const handleDestinationSelect = useCallback(
    async (place: PlaceResult) => {
      if (place.geometry?.location) {
        const coords = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        };
        setDestinationName(place.name || place.formatted_address || 'Destination');
        const originCoords = await startJourney(coords);

        // Reverse geocode the origin to get its address
        if (originCoords) {
          const address = await reverseGeocode(originCoords);
          if (address) {
            setOriginName(address);
          }
        }
      }
    },
    [startJourney]
  );

  const handleStopJourney = useCallback(() => {
    setShowStopModal(false);
    stopJourney();
    setDestinationName('');
    setOriginName('Current Location');
  }, [stopJourney]);

  const handleStartNewJourney = useCallback(() => {
    setCelebrationDismissed(false);
    stopJourney();
    setDestinationName('');
    setOriginName('Current Location');
  }, [stopJourney]);

  const handleCloseCelebration = useCallback(() => {
    setCelebrationDismissed(true);
  }, []);

  // Derive celebration visibility directly from state
  const showCelebration = hasReachedDestination && !celebrationDismissed;

  // Close details sheet when destination is reached
  React.useEffect(() => {
    if (hasReachedDestination) {
      setShowDetailsSheet(false);
    }
  }, [hasReachedDestination]);

  // Debug logging for celebration state
  React.useEffect(() => {
    console.log('🎊 [App] Celebration state:', {
      hasReachedDestination,
      celebrationDismissed,
      showCelebration,
    });
  }, [hasReachedDestination, celebrationDismissed, showCelebration]);

  const responsiveStyles = useMemo(() => {
    const isSmallPhone = width < 360;
    const isTablet = width >= 768;
    const baseTopPadding = Platform.OS === 'ios' ? 60 : 40;

    const horizontalPadding = isTablet ? 48 : isSmallPhone ? 16 : 24;
    const topPadding = isTablet
      ? baseTopPadding + 20
      : isSmallPhone
        ? baseTopPadding - 12
        : baseTopPadding;
    const bottomPadding = isTablet ? 56 : isSmallPhone ? 24 : 32;

    return {
      scrollViewContent: {
        paddingHorizontal: horizontalPadding,
        paddingTop: topPadding,
        paddingBottom: bottomPadding,
        alignItems: 'center' as const,
      },
      contentWrapper: {
        width: '100%' as const,
        maxWidth: isTablet ? 720 : 540,
      },
      header: {
        marginBottom: isSmallPhone ? 28 : isTablet ? 56 : 44,
        paddingHorizontal: isTablet ? 0 : 8,
      },
      title: {
        fontSize: isSmallPhone ? 36 : isTablet ? 56 : 48,
        lineHeight: isSmallPhone ? 42 : isTablet ? 66 : 56,
      },
      subtitle: {
        fontSize: isSmallPhone ? 18 : isTablet ? 28 : 24,
        lineHeight: isSmallPhone ? 24 : isTablet ? 34 : 30,
        marginTop: isSmallPhone ? 4 : 8,
      },
      searchContainer: {
        marginBottom: isSmallPhone ? 20 : 32,
      },
      journeyContainer: {
        marginBottom: isSmallPhone ? 20 : 32,
      },
    };
  }, [width]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('../assets/journey-background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollViewContent, responsiveStyles.scrollViewContent]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.contentWrapper, responsiveStyles.contentWrapper]}>
            {/* Header */}
            <View style={[styles.header, responsiveStyles.header]}>
              <Text style={[styles.title, responsiveStyles.title]}>Are we nearly there?</Text>
              <Text style={[styles.subtitle, responsiveStyles.subtitle]}>
                Kid-friendly journey progress tracking
              </Text>
            </View>

            {/* Destination Search */}
            {!isTracking && (
              <View style={[styles.searchContainer, responsiveStyles.searchContainer]}>
                <DestinationSearch onDestinationSelect={handleDestinationSelect} />
              </View>
            )}

            {/* Error Display */}
            <ErrorDisplay error={error} />

            {/* Journey Visualizer */}
            {isTracking && (
              <View style={[styles.journeyContainer, responsiveStyles.journeyContainer]}>
                <JourneyVisualizer
                  progress={progress}
                  onShowDetails={() => setShowDetailsSheet(true)}
                />

                <JourneyInfo
                  remainingDistance={remainingDistance}
                  onStopJourney={() => setShowStopModal(true)}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Debug Panel - positioned absolutely relative to screen */}
        {isTracking && __DEV__ && (
          <DebugPanel
            currentPosition={currentPosition}
            origin={origin}
            destination={destination}
            onSetMockLocation={setMockPosition}
            onSimulateMovement={simulateJourney}
            isSimulating={isSimulating}
          />
        )}
      </ImageBackground>

      {/* Stop Journey Confirmation Modal */}
      <StopJourneyModal
        isOpen={showStopModal}
        onClose={() => setShowStopModal(false)}
        onConfirm={handleStopJourney}
      />

      {/* Journey Details Bottom Sheet */}
      <JourneyDetailsSheet
        isOpen={showDetailsSheet}
        onClose={() => setShowDetailsSheet(false)}
        originName={originName}
        destinationName={destinationName}
        remainingDistance={remainingDistance}
        progress={progress}
      />

      {/* Destination Celebration */}
      {showCelebration && (
        <DestinationCelebration
          onClose={handleCloseCelebration}
          onStartNewJourney={handleStartNewJourney}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#9333EA',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Nunito_900Black',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Nunito_700Bold',
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  journeyContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
});
