// src/components/TranscriptionButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';

type Props = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function TranscriptionButton({ onPress, disabled = false, loading = false }: Props) {
  return (
    <Pressable style={[styles.button, disabled && styles.buttonDisabled]} onPress={onPress} disabled={disabled}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Iniciar transcripción</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
