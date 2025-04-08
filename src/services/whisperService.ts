import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Whisper from 'whisper.rn';
import { MODEL_ASSET, MODEL_DEST_PATH, TEST_AUDIO_PATH } from '../constants/paths';

let whisperContext: any = null;

export async function prepareModel(): Promise<boolean> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(MODEL_DEST_PATH);

    if (!fileInfo.exists) {
      const asset = Asset.fromModule(MODEL_ASSET);
      await asset.downloadAsync();
      await FileSystem.copyAsync({ from: asset.localUri!, to: MODEL_DEST_PATH });
      console.log('Modelo copiado a:', MODEL_DEST_PATH);
    }

    whisperContext = await Whisper.initWhisper({ filePath: MODEL_DEST_PATH });
    console.log('Modelo cargado exitosamente');
    return true;
  } catch (error) {
    console.error('Error preparando el modelo:', error);
    return false;
  }
}

export async function transcribeTestAudio(): Promise<string> {
  if (!whisperContext) throw new Error('Modelo no cargado');

  const result = await whisperContext.transcribe({ filePath: TEST_AUDIO_PATH });
  return result.text;
}
