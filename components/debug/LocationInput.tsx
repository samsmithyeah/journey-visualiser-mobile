import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Target, Pin } from 'lucide-react-native';

interface LocationInputProps {
  mockLat: string;
  mockLng: string;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  onSetLocation: () => void;
}

export default function LocationInput({
  mockLat,
  mockLng,
  onLatChange,
  onLngChange,
  onSetLocation,
}: LocationInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Target color="#9333EA" size={20} />
        <Text style={styles.headerText}>Set mock location:</Text>
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Latitude"
        value={mockLat}
        onChangeText={onLatChange}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Longitude"
        value={mockLng}
        onChangeText={onLngChange}
      />
      <TouchableOpacity style={styles.button} onPress={onSetLocation}>
        <Pin color="#ffffff" size={20} />
        <Text style={styles.buttonText}>Set location</Text>
      </TouchableOpacity>
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
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: '#D8B4FE',
    borderRadius: 12,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#ffffff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
});
