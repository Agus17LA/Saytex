import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { startRecording, stopRecording } from '../services/audioRecorder';
import { getWhisperContext } from '../services/whisperService';

type Props = {
  onTranscription: (text: string) => void;
};

export default function RecordAndTranscribeButton({ onTranscription }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (isRecording) {
      setIsRecording(false);
      setLoading(true);

      try {
        const filePath = await stopRecording();
        const whisper = getWhisperContext();
        const { stop, promise } = await whisper.transcribe(filePath, {
          language: 'es',
        });
        const result = await promise;
        onTranscription(result.text);
      } catch (error: any) {
        console.error('❌ Error al transcribir grabación:', error.message || error);
        onTranscription('[ERROR]');
      } finally {
        setLoading(false);
      }
    } else {
      await startRecording();
      setIsRecording(true);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? 'Detener y Transcribir' : 'Grabar con Micrófono'}
        onPress={handlePress}
      />
      {loading && <ActivityIndicator style={styles.spinner} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  spinner: {
    marginTop: 8,
  },
});
