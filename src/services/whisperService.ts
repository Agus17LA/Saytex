// src/services/whisperService.ts
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { initWhisper, WhisperContext } from 'whisper.rn';
import { MODEL_ASSET, MODEL_DEST_PATH, TEST_AUDIO_PATH } from '../constants/paths';

let whisperContext: WhisperContext | null = null;

export async function prepareModel(): Promise<boolean> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(MODEL_DEST_PATH);

    if (!fileInfo.exists) {
      const asset = Asset.fromModule(MODEL_ASSET);
      await asset.downloadAsync();
      await FileSystem.copyAsync({ from: asset.localUri!, to: MODEL_DEST_PATH });
      console.log('Modelo copiado a:', MODEL_DEST_PATH);
    }

    whisperContext = await initWhisper({ filePath: MODEL_DEST_PATH });
    console.log('Modelo cargado exitosamente');
    return true;
  } catch (error) {
    console.error('Error preparando el modelo:', error);
    return false;
  }
}

export async function transcribeTestAudio(): Promise<string> {
  if (!whisperContext) throw new Error('Modelo no cargado');

  const options = { language: 'es' };
  const { promise } = whisperContext.transcribe(TEST_AUDIO_PATH, options);
  const { result } = await promise;
  return result;
}