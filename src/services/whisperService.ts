import { initWhisper, transcribe } from 'whisper.rn';
import * as FileSystem from 'expo-file-system';
import { log } from '../utils/logger';

const GGML_URL =
  'https://github.com/Agus17LA/saytex-models/releases/download/Model/ggml-base.bin';

const AUDIO_URL =
  'https://github.com/Agus17LA/saytex-models/releases/download/model/AudioTest.wav';

export const MODEL_DEST_PATH = FileSystem.documentDirectory + 'ggml-base.bin';
export const AUDIO_DEST_PATH = FileSystem.documentDirectory + 'AudioTest.wav';

let whisper: any; // instancia de WhisperContext

/**
 * Descarga un archivo si no existe
 */
async function downloadIfNeeded(url: string, destination: string): Promise<string> {
  const fileInfo = await FileSystem.getInfoAsync(destination);
  if (!fileInfo.exists) {
    log(`⬇️ Descargando desde: ${url}`);
    const result = await FileSystem.downloadAsync(url, destination);
    log(`✅ Archivo descargado: ${result.uri}`);
    return result.uri;
  } else {
    log(`📁 Archivo ya existe: ${destination}`);
    return destination;
  }
}

/**
 * Inicializa Whisper descargando modelo y audio si hace falta
 */
export async function prepareWhisper(): Promise<void> {
  log('🧠 Preparando modelo Whisper...');

  const modelPath = await downloadIfNeeded(GGML_URL, MODEL_DEST_PATH);
  await downloadIfNeeded(AUDIO_URL, AUDIO_DEST_PATH);

  const modelInfo = await FileSystem.getInfoAsync(modelPath);
  if(modelInfo.exists)
    log('📦 Tamaño del modelo:', modelInfo.size);

  if (typeof initWhisper !== 'function') {
    throw new Error('❌ initWhisper no está disponible');
  }

  log('🧠 Inicializando modelo Whisper...');
  whisper = await initWhisper({ filePath: modelPath });

  log('✅ Whisper inicializado y listo');
}

/**
 * Transcribe el archivo de prueba
 */
export async function transcribeTestAudio(): Promise<string> {
  const info = await FileSystem.getInfoAsync(AUDIO_DEST_PATH);
  if (!info.exists) {
    throw new Error('⚠️ Archivo de audio no encontrado');
  }
  const options = { language: 'es' };
  log(`🧾 Transcribiendo audio: ${AUDIO_DEST_PATH}`);
  const { stop, promise } = await whisper.transcribe(AUDIO_DEST_PATH, options);
  const { result } = await promise;
  log('📝 Resultado:', result);
  return result.text;
}
