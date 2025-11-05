import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Home, Target, X, Navigation } from 'lucide-react-native';

interface JourneyDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  originName: string;
  destinationName: string;
  remainingDistance: number | null;
  progress: number;
}

export default function JourneyDetailsSheet({
  isOpen,
  onClose,
  originName,
  destinationName,
  remainingDistance,
  progress,
}: JourneyDetailsSheetProps) {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Journey details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#9333EA" size={24} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Progress summary */}
            <View style={styles.progressSummary}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercentage}>{progress.toFixed(0)}%</Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Journey progress</Text>
                {remainingDistance !== null && (
                  <View style={styles.distanceRow}>
                    <Navigation color="#FB923C" size={16} />
                    <Text style={styles.distanceText}>
                      {remainingDistance.toFixed(1)} km remaining
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Origin */}
            <View style={styles.locationSection}>
              <View style={styles.locationHeader}>
                <View style={styles.iconBadge}>
                  <Home color="#ffffff" size={20} />
                </View>
                <Text style={styles.locationLabel}>Starting from</Text>
              </View>
              <Text style={styles.locationAddress}>{originName}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Destination */}
            <View style={styles.locationSection}>
              <View style={styles.locationHeader}>
                <View style={[styles.iconBadge, styles.iconBadgeDestination]}>
                  <Target color="#ffffff" size={20} />
                </View>
                <Text style={styles.locationLabel}>Heading to</Text>
              </View>
              <Text style={styles.locationAddress}>{destinationName}</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Nunito_800ExtraBold',
    color: '#9333EA',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Nunito_900Black',
    color: '#ffffff',
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    color: '#374151',
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
    color: '#FB923C',
  },
  locationSection: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadgeDestination: {
    backgroundColor: '#F87171',
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationAddress: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    color: '#1F2937',
    lineHeight: 28,
    paddingLeft: 46,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
});
