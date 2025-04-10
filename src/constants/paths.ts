// src/constants/paths.ts
import * as FileSystem from 'expo-file-system';

export const MODEL_FILE_NAME = 'ggml-base.bin';
export const MODEL_DEST_PATH = FileSystem.documentDirectory + MODEL_FILE_NAME;

export const TEST_AUDIO_FILE = 'AudioTest.wav';
export const AUDIO_DEST_PATH = FileSystem.documentDirectory + TEST_AUDIO_FILE;

export const GGML_URL =
  'https://github.com/Agus17LA/saytex-models/releases/download/Model/ggml-base.bin';

export const AUDIO_URL =
  'https://github.com/Agus17LA/saytex-models/releases/download/model/AudioTest.wav';

export const RECORDING_PATH = FileSystem.documentDirectory + 'recorded.mp4';