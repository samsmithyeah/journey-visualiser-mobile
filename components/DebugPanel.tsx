import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { Wrench } from 'lucide-react-native';
import { Coordinates } from '../types';
import Button from './Button';
import CurrentPositionDisplay from './debug/CurrentPositionDisplay';
import LocationInput from './debug/LocationInput';
import QuickSetButtons from './debug/QuickSetButtons';
import SimulationControls from './debug/SimulationControls';

interface DebugPanelProps {
  currentPosition: Coordinates | null;
  origin: Coordinates | null;
  destination: Coordinates | null;
  onSetMockLocation: (lat: number, lng: number) => void;
  onSimulateMovement: () => void;
  isSimulating: boolean;
}

export default function DebugPanel({
  currentPosition,
  origin,
  destination,
  onSetMockLocation,
  onSimulateMovement,
  isSimulating,
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mockLat, setMockLat] = useState('');
  const [mockLng, setMockLng] = useState('');

  // Update input fields when current position changes
  useEffect(() => {
    if (currentPosition) {
      setMockLat(currentPosition.lat.toFixed(6));
      setMockLng(currentPosition.lng.toFixed(6));
    }
  }, [currentPosition]);

  const handleSetLocation = () => {
    const lat = parseFloat(mockLat);
    const lng = parseFloat(mockLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      onSetMockLocation(lat, lng);
    }
  };

  const handleQuickSet = (type: 'origin' | 'destination' | 'halfway') => {
    if (!origin || !destination) return;

    if (type === 'origin') {
      setMockLat(origin.lat.toFixed(6));
      setMockLng(origin.lng.toFixed(6));
      onSetMockLocation(origin.lat, origin.lng);
    } else if (type === 'destination') {
      setMockLat(destination.lat.toFixed(6));
      setMockLng(destination.lng.toFixed(6));
      onSetMockLocation(destination.lat, destination.lng);
    } else if (type === 'halfway') {
      const halfLat = (origin.lat + destination.lat) / 2;
      const halfLng = (origin.lng + destination.lng) / 2;
      setMockLat(halfLat.toFixed(6));
      setMockLng(halfLng.toFixed(6));
      onSetMockLocation(halfLat, halfLng);
    }
  };

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      <Button
        title={isExpanded ? 'Hide debug' : 'Debug mode'}
        onPress={() => setIsExpanded(!isExpanded)}
        variant="purple"
        icon={Wrench}
        iconPosition="left"
        iconSize={20}
        style={styles.toggleButton}
      />

      {/* Debug Panel Modal */}
      <Modal
        visible={isExpanded}
        transparent
        animationType="slide"
        onRequestClose={() => setIsExpanded(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Wrench color="#9333EA" size={24} />
                <Text style={styles.headerText}>Debug panel</Text>
              </View>
              <Button
                title="Close"
                onPress={() => setIsExpanded(false)}
                variant="destructive"
                size="small"
                style={styles.closeButton}
              />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <CurrentPositionDisplay currentPosition={currentPosition} />

              <LocationInput
                mockLat={mockLat}
                mockLng={mockLng}
                onLatChange={setMockLat}
                onLngChange={setMockLng}
                onSetLocation={handleSetLocation}
              />

              <QuickSetButtons
                origin={origin}
                destination={destination}
                onQuickSet={handleQuickSet}
              />

              <SimulationControls
                origin={origin}
                destination={destination}
                isSimulating={isSimulating}
                onSimulate={onSimulateMovement}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    zIndex: 50,
  },
  toggleButton: {
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: '#A855F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#9333EA',
  },
  closeButton: {
    borderRadius: 12,
  },
  scrollView: {
    maxHeight: '100%',
  },
});
