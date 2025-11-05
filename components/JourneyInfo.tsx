import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Navigation, StopCircle } from 'lucide-react-native';
import Button from './Button';

interface JourneyInfoProps {
  remainingDistance: number | null;
  onStopJourney: () => void;
}

export default function JourneyInfo({ remainingDistance, onStopJourney }: JourneyInfoProps) {
  const { width } = useWindowDimensions();

  const responsiveStyles = useMemo(() => {
    const isSmallPhone = width < 360;
    const isTablet = width >= 768;

    return {
      container: {
        marginTop: isSmallPhone ? 16 : 24,
      },
      distanceContainer: {
        paddingHorizontal: isSmallPhone ? 20 : isTablet ? 28 : 24,
        paddingVertical: isSmallPhone ? 10 : isTablet ? 16 : 12,
        marginBottom: isSmallPhone ? 20 : 24,
      },
      distanceText: {
        fontSize: isSmallPhone ? 20 : isTablet ? 26 : 24,
      },
      stopButton: {
        paddingHorizontal: isSmallPhone ? 24 : isTablet ? 36 : 32,
        paddingVertical: isSmallPhone ? 12 : isTablet ? 20 : 16,
      },
      stopButtonText: {
        fontSize: isSmallPhone ? 18 : isTablet ? 22 : 20,
      },
      navigationIconSize: isSmallPhone ? 24 : isTablet ? 32 : 28,
      stopIconSize: isSmallPhone ? 22 : isTablet ? 28 : 24,
    };
  }, [width]);

  return (
    <View style={[styles.container, responsiveStyles.container]}>
      {remainingDistance !== null && (
        <View style={[styles.distanceContainer, responsiveStyles.distanceContainer]}>
          <Navigation color="#ffffff" size={responsiveStyles.navigationIconSize} />
          <Text style={[styles.distanceText, responsiveStyles.distanceText]}>
            {remainingDistance.toFixed(1)} km remaining
          </Text>
        </View>
      )}

      <Button
        title="Stop journey"
        onPress={onStopJourney}
        variant="destructive"
        icon={StopCircle}
        iconPosition="left"
        iconSize={responsiveStyles.stopIconSize}
        style={[styles.stopButton, responsiveStyles.stopButton]}
        textStyle={responsiveStyles.stopButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 24,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(251, 146, 60, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FB923C',
    marginBottom: 24,
  },
  distanceText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  stopButton: {
    borderRadius: 24,
    borderWidth: 4,
  },
});
