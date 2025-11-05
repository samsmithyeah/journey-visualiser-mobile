import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import Button from './Button';

interface StopJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function StopJourneyModal({ isOpen, onClose, onConfirm }: StopJourneyModalProps) {
  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <AlertTriangle color="#DC2626" size={48} />
          </View>

          <Text style={styles.title}>Stop journey?</Text>
          <Text style={styles.message}>
            Are you sure you want to stop tracking this journey? Your progress will be lost.
          </Text>

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} variant="secondary" style={styles.button} />
            <Button
              title="Stop journey"
              onPress={onConfirm}
              variant="destructive"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 4,
    borderColor: '#FDE047',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
