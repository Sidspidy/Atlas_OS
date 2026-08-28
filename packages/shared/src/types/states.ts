export enum AtlasState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  SEARCHING = 'SEARCHING',
  PLANNING = 'PLANNING',
  WORKING = 'WORKING',
  SPEAKING = 'SPEAKING',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SLEEP = 'SLEEP',
  EXCITED = 'EXCITED',
  PAUSED = 'PAUSED',
  AWAITING_PERMISSION = 'AWAITING_PERMISSION'
}

export type AtlasStateTheme = {
  primaryGlow: string;
  accentColor: string;
  eyeStyle: string;
  pulseRate: number;
};
