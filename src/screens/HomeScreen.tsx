// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as whisperService from '../services/whisperService';
import TranscriptionButton from '../components/TranscriptionButton';
import { prepareTestAudio } from '../utils/fileUtils';

export default function HomeScreen() {
  const [isModelReady, setIsModelReady] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    const init = async () => {
        await prepareTestAudio();
        const success = await whisperService.prepareModel();
        setIsModelReady(success);
    };
    init();
  }, []);

  const handleTranscription = useCallback(async () => {
    setIsTranscribing(true);
    try {
      const result = await whisperService.transcribeTestAudio();
      setTranscription(result);
    } catch (error) {
      Alert.alert('Error', 'No se pudo transcribir el archivo de audio.');
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  if (!isModelReady) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Cargando modelo de transcripción...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TranscriptionButton onPress={handleTranscription} disabled={isTranscribing} loading={isTranscribing} />
      {transcription && (
        <View style={styles.transcriptionBox}>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  infoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  transcriptionBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    width: '100%',
  },
  transcriptionText: {
    fontSize: 15,
    color: '#333',
  },
});
