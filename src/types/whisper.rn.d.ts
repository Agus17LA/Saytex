declare module 'whisper.rn' {
    export function initWhisper(options: { filePath: string }): Promise<void>;
    export function transcribe(options: { filePath: string }): Promise<{ text: string }>;
  }
  