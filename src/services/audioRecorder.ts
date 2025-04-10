import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { log } from '../utils/logger';
import { RECORDING_PATH } from '../constants/paths';
import { RNFFmpeg } from 'react-native-ffmpeg';

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

  const m4aPath = uri;
  const wavPath = RECORDING_PATH;

  log('🎛️ Convirtiendo a .wav mono 16kHz...');
  const command = `-y -i ${m4aPath} -ac 1 -ar 16000 -sample_fmt s16 ${wavPath}`;
  const rc = await RNFFmpeg.execute(command);

  if (rc !== 0) {
    throw new Error(`❌ Error en la conversión de audio (código ${rc})`);
  }

  log(`✅ Conversión finalizada: ${wavPath}`);
  recording = null;
  return wavPath;
}
