import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { log } from '../utils/logger';
import { RECORDING_PATH } from '../constants/paths';

let recording: Audio.Recording | null = null;

export async function startRecording(): Promise<void> {
  try {
    log('🎙️ Solicitando permisos...');
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) throw new Error('Permiso denegado');

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    log('⏺️ Iniciando grabación...');
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    recording = newRecording;
    log('🎤 Grabando...');
  } catch (error) {
    log('❌ Error al iniciar grabación:', error);
    throw error;
  }
}

export async function stopRecording(): Promise<string> {
  if (!recording) throw new Error('⚠️ No hay grabación activa');

  log('⏹️ Deteniendo grabación...');
  await recording.stopAndUnloadAsync();

  const uri = recording.getURI();
  if (!uri) throw new Error('❌ No se pudo obtener el archivo grabado');

  const targetPath = RECORDING_PATH;
  await FileSystem.copyAsync({ from: uri, to: targetPath });

  log(`📁 Archivo guardado: ${targetPath}`);
  recording = null;
  return targetPath;
}
