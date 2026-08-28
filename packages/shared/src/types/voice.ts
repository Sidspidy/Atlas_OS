export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

export interface WakeWordStatus {
  active: boolean;
  phrase: string;
  sensitivity: number;
  lastDetectedAt?: string;
}

export interface STTTranscriptResult {
  text: string;
  confidence: number;
  language: string;
  durationMs: number;
}

export interface TTSRequestPayload {
  text: string;
  voiceId?: string;
  speed?: number;
  pitch?: number;
}

export interface AudioLevelMeter {
  level: number;
  frequencyData: number[];
}
