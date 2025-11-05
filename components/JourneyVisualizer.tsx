import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Home, Target, Car } from 'lucide-react-native';

interface JourneyVisualizerProps {
  progress: number; // 0 to 100
  onShowDetails?: () => void;
}

export default function JourneyVisualizer({ progress, onShowDetails }: JourneyVisualizerProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const { width } = useWindowDimensions();

  const responsiveStyles = useMemo(() => {
    const isSmallPhone = width < 360;
    const isTablet = width >= 768;
    const blobSize = isSmallPhone ? 44 : isTablet ? 60 : 52;
    const containerPadding = isSmallPhone ? 20 : isTablet ? 44 : 28;

    return {
      container: {
        paddingHorizontal: containerPadding,
        paddingVertical: containerPadding + (isSmallPhone ? 0 : 4),
      },
      progressSection: {},
      blobContainer: {
        width: blobSize,
        height: blobSize,
        marginLeft: -blobSize / 2,
      },
      blob: {
        width: blobSize,
        height: blobSize,
        borderRadius: blobSize / 2,
      },
      percentageContainer: {},
      percentageText: {
        fontSize: isSmallPhone ? 44 : isTablet ? 72 : 56,
      },
      completeText: {
        fontSize: isSmallPhone ? 16 : isTablet ? 22 : 18,
      },
      carIconSize: isSmallPhone ? 22 : isTablet ? 32 : 26,
    };
  }, [width]);

  return (
    <View style={[styles.container, responsiveStyles.container]}>
      {/* Progress line container with icons above */}
      <View style={[styles.progressSection, responsiveStyles.progressSection]}>
        {/* Icons row */}
        <View style={styles.iconsRow}>
          {/* Origin icon */}
          <TouchableOpacity style={styles.originIcon} onPress={onShowDetails} activeOpacity={0.7}>
            <Home color="#ffffff" size={20} />
          </TouchableOpacity>

          {/* Spacer */}
          <View style={styles.iconSpacer} />

          {/* Destination icon */}
          <TouchableOpacity
            style={styles.destinationIcon}
            onPress={onShowDetails}
            activeOpacity={0.7}
          >
            <Target color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>

        {/* Progress track */}
        <View style={styles.progressTrack}>
          {/* Background line */}
          <View style={styles.backgroundLine} />

          {/* Progress line */}
          <View style={[styles.progressLine, { width: `${clampedProgress}%` }]} />

          {/* Animated blob */}
          <View
            style={[
              styles.blobContainer,
              responsiveStyles.blobContainer,
              { left: `${clampedProgress}%` },
            ]}
          >
            <View style={[styles.blob, responsiveStyles.blob]}>
              <Car color="#ffffff" size={responsiveStyles.carIconSize} />
            </View>
          </View>
        </View>
      </View>

      {/* Progress percentage */}
      <View style={[styles.percentageContainer, responsiveStyles.percentageContainer]}>
        <Text style={[styles.percentageText, responsiveStyles.percentageText]}>
          {clampedProgress.toFixed(0)}%
        </Text>
        <Text style={[styles.completeText, responsiveStyles.completeText]}>
          of journey complete
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 600,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FDE047',
  },
  progressSection: {},
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -32,
    marginHorizontal: -28,
  },
  iconSpacer: {
    flex: 1,
  },
  progressTrack: {
    height: 80,
    justifyContent: 'center',
    position: 'relative',
  },
  originIcon: {
    backgroundColor: '#4ADE80',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#16A34A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationIcon: {
    backgroundColor: '#F87171',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#DC2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundLine: {
    position: 'absolute',
    width: '100%',
    height: 12,
    backgroundColor: '#D1D5DB',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6B7280',
  },
  progressLine: {
    position: 'absolute',
    height: 12,
    backgroundColor: '#FBBF24',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  blobContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  blob: {
    backgroundColor: '#EC4899',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  percentageContainer: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 60,
    fontWeight: '900',
    color: '#9333EA',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  completeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginTop: 6,
  },
});
