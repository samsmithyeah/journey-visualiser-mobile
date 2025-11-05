import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Coordinates } from '../../types';

interface CurrentPositionDisplayProps {
  currentPosition: Coordinates | null;
}

export default function CurrentPositionDisplay({ currentPosition }: CurrentPositionDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MapPin color="#2563EB" size={20} />
        <Text style={styles.headerText}>Current position:</Text>
      </View>
      {currentPosition ? (
        <View style={styles.coordinates}>
          <Text style={styles.coordinateText}>Lat: {currentPosition.lat.toFixed(6)}</Text>
          <Text style={styles.coordinateText}>Lng: {currentPosition.lng.toFixed(6)}</Text>
        </View>
      ) : (
        <Text style={styles.noPosition}>No position set</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#93C5FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2563EB',
  },
  coordinates: {
    gap: 4,
  },
  coordinateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'monospace',
  },
  noPosition: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});
