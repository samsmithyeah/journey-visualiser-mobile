import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PartyPopper, Trophy, Star, Sparkles, Eye, MapPin } from 'lucide-react-native';
import Button from './Button';

interface DestinationCelebrationProps {
  onClose: () => void;
  onStartNewJourney: () => void;
}

export default function DestinationCelebration({
  onClose,
  onStartNewJourney,
}: DestinationCelebrationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim1 = useRef(new Animated.Value(0)).current;
  const bounceAnim2 = useRef(new Animated.Value(0)).current;
  const bounceAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation for modal
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Bounce animations for icons
    const createBounce = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -10,
            duration: 500,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createBounce(bounceAnim1, 0);
    createBounce(bounceAnim2, 100);
    createBounce(bounceAnim3, 200);
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
        {/* Celebration Icons */}
        <View style={styles.iconsContainer}>
          <Animated.View style={{ transform: [{ translateY: bounceAnim1 }] }}>
            <PartyPopper color="#EC4899" size={64} />
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: bounceAnim2 }] }}>
            <Trophy color="#FBBF24" size={80} />
          </Animated.View>
          <Animated.View style={{ transform: [{ translateY: bounceAnim3 }] }}>
            <Star color="#A855F7" size={64} />
          </Animated.View>
        </View>

        {/* Main Message */}
        <Text style={styles.title}>We&apos;re here!</Text>

        <View style={styles.messageContainer}>
          <View style={styles.messageRow}>
            <Sparkles color="#FBBF24" size={32} />
            <Text style={styles.message}>You made it to your destination!</Text>
            <Sparkles color="#FBBF24" size={32} />
          </View>
        </View>

        {/* Animated Success Checkmark */}
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Keep viewing"
            onPress={onClose}
            variant="secondary"
            size="medium"
            icon={Eye}
            iconPosition="left"
          />
          <Button
            title="Start new journey"
            onPress={onStartNewJourney}
            variant="purple"
            size="medium"
            icon={MapPin}
            iconPosition="left"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 99999,
    elevation: 99999,
  },
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 32,
    padding: 32,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 30,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FDE047',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#9333EA',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
    fontFamily: 'Nunito_900Black',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  message: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold',
  },
  checkmarkContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  checkmark: {
    width: 96,
    height: 96,
    backgroundColor: '#10B981',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  checkmarkText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
  },
});
