// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { prepareWhisper, transcribeTestAudio } from '../services/whisperService';
import TranscriptionButton from '../components/TranscriptionButton';

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transcription, setTranscription] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await prepareWhisper();
      } catch (error) {
        Alert.alert('Error al inicializar Whisper', String(error));
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleTranscription = async () => {
    try {
      setIsLoading(true);
      const result = await transcribeTestAudio();
      setTranscription(result);
    } catch (error) {
      Alert.alert('Error al transcribir audio', String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <TranscriptionButton onPress={handleTranscription} />
          {transcription && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>{transcription}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#eee',
    borderRadius: 12,
  },
  resultText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
