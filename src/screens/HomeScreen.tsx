// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { prepareWhisper, transcribeTestAudio } from '../services/whisperService';
import TranscriptionButton from '../components/TranscriptionButton';
import RecordAndTranscribeButton from '../components/RecordAndTranscribeButton';

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [testTranscription, setTestTranscription] = useState<string | null>(null);
  const [recordedTranscription, setRecordedTranscription] = useState<string | null>(null);

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

  const handleTestTranscription = async () => {
    try {
      setIsLoading(true);
      const result = await transcribeTestAudio();
      setTestTranscription(result);
    } catch (error) {
      Alert.alert('Error al transcribir audio de prueba', String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordedTranscription = (text: string) => {
    setRecordedTranscription(text);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={styles.title}>Transcripción de Audio Subido</Text>
          <TranscriptionButton onPress={handleTestTranscription} />
          {testTranscription && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>📝 Resultado:</Text>
              <Text style={styles.resultText}>{testTranscription}</Text>
            </View>
          )}

          <View style={styles.separator} />

          <Text style={styles.title}>Grabar con Micrófono</Text>
          <RecordAndTranscribeButton onTranscription={handleRecordedTranscription} />
          {recordedTranscription && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>📝 Resultado:</Text>
              <Text style={styles.resultText}>{recordedTranscription}</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  resultLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  separator: {
    marginVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
