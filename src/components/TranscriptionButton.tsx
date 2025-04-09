// src/components/TranscriptionButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

const TranscriptionButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>Iniciar transcripción</Text>
    </Pressable>
  );
};

export default TranscriptionButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
