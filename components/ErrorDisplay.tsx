import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <View style={styles.container}>
      <AlertCircle color="#DC2626" size={24} />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#DC2626',
    marginVertical: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
});
