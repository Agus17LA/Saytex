// src/constants/paths.ts
import * as FileSystem from 'expo-file-system';

export const MODEL_FILE_NAME = 'ggml-base.bin';
export const MODEL_DEST_PATH = FileSystem.cacheDirectory + MODEL_FILE_NAME;

export const TEST_AUDIO_FILE = 'AudioTest.wav';
export const TEST_AUDIO_PATH = FileSystem.documentDirectory + TEST_AUDIO_FILE;

export const AUDIO_ASSET = '../../../assets/audio/AudioTest.wav';
