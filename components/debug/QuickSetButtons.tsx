import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Star, Target, Zap } from 'lucide-react-native';
import { Coordinates } from '../../types';

interface QuickSetButtonsProps {
  origin: Coordinates | null;
  destination: Coordinates | null;
  onQuickSet: (type: 'origin' | 'destination' | 'halfway') => void;
}

export default function QuickSetButtons({ origin, destination, onQuickSet }: QuickSetButtonsProps) {
  if (!origin || !destination) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Zap color="#9333EA" size={20} />
        <Text style={styles.headerText}>Quick set:</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.originButton} onPress={() => onQuickSet('origin')}>
          <Home color="#ffffff" size={16} />
          <Text style={styles.buttonText}>Origin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.halfwayButton} onPress={() => onQuickSet('halfway')}>
          <Star color="#ffffff" size={16} />
          <Text style={styles.buttonText}>50%</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.destButton} onPress={() => onQuickSet('destination')}>
          <Target color="#ffffff" size={16} />
          <Text style={styles.buttonText}>Dest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#9333EA',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  originButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#10B981',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  halfwayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#FBBF24',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  destButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
