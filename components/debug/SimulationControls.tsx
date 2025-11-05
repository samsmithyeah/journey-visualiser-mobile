import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Lightbulb } from 'lucide-react-native';
import { Coordinates } from '../../types';

interface SimulationControlsProps {
  origin: Coordinates | null;
  destination: Coordinates | null;
  isSimulating: boolean;
  onSimulate: () => void;
}

export default function SimulationControls({
  origin,
  destination,
  isSimulating,
  onSimulate,
}: SimulationControlsProps) {
  const isDisabled = !origin || !destination || isSimulating;

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={onSimulate}
        disabled={isDisabled}
      >
        {isSimulating ? (
          <>
            <Pause color="#ffffff" size={20} />
            <Text style={styles.buttonText}>Stop simulation</Text>
          </>
        ) : (
          <>
            <Play color="#ffffff" size={20} />
            <Text style={styles.buttonText}>Simulate journey</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.tip}>
        <Lightbulb color="#D97706" size={16} />
        <Text style={styles.tipText}>Tip: Use simulation or manual inputs for testing</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#9333EA',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#ffffff',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    lineHeight: 18,
  },
});
