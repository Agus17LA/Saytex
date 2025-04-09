// src/utils/fileUtils.ts
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { TEST_AUDIO_PATH, AUDIO_ASSET } from '../constants/paths';

export async function prepareTestAudio(): Promise<void> {
  const fileInfo = await FileSystem.getInfoAsync(TEST_AUDIO_PATH);
  if (!fileInfo.exists) {
    const asset = Asset.fromModule(AUDIO_ASSET);
    await asset.downloadAsync();
    await FileSystem.copyAsync({ from: asset.localUri!, to: TEST_AUDIO_PATH });
    console.log('Audio de prueba copiado a:', TEST_AUDIO_PATH);
  }
}
