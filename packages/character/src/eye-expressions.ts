import { AtlasState } from '@atlas-os/shared';

export interface EyeExpressionConfig {
  state: AtlasState;
  eyeType:
    | 'default'
    | 'equalizer'
    | 'scanning'
    | 'radar'
    | 'nodes'
    | 'spinner'
    | 'waveform'
    | 'stars'
    | 'warning'
    | 'error'
    | 'closed'
    | 'excited'
    | 'paused'
    | 'lock';
  primaryColor: string;
  glowColor: string;
  pulseSpeedMs: number;
  label: string;
  enableCursorTracking: boolean;
  blinkIntervalMs: number;
  pupilScale: number;
}

export const EYE_EXPRESSION_MAP: Record<AtlasState, EyeExpressionConfig> = {
  [AtlasState.IDLE]: {
    state: AtlasState.IDLE,
    eyeType: 'default',
    primaryColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    pulseSpeedMs: 3000,
    label: 'Atlas is ready',
    enableCursorTracking: true,
    blinkIntervalMs: 3500,
    pupilScale: 1.0
  },
  [AtlasState.LISTENING]: {
    state: AtlasState.LISTENING,
    eyeType: 'equalizer',
    primaryColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    pulseSpeedMs: 800,
    label: 'Listening...',
    enableCursorTracking: false,
    blinkIntervalMs: 0,
    pupilScale: 1.1
  },
  [AtlasState.THINKING]: {
    state: AtlasState.THINKING,
    eyeType: 'scanning',
    primaryColor: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.5)',
    pulseSpeedMs: 1200,
    label: 'Thinking...',
    enableCursorTracking: false,
    blinkIntervalMs: 0,
    pupilScale: 0.9
  },
  [AtlasState.SEARCHING]: {
    state: AtlasState.SEARCHING,
    eyeType: 'radar',
    primaryColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.5)',
    pulseSpeedMs: 1000,
    label: 'Searching local context...',
    enableCursorTracking: true,
    blinkIntervalMs: 4000,
    pupilScale: 1.0
  },
  [AtlasState.PLANNING]: {
    state: AtlasState.PLANNING,
    eyeType: 'nodes',
    primaryColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.5)',
    pulseSpeedMs: 1500,
    label: 'Formulating execution plan...',
    enableCursorTracking: false,
    blinkIntervalMs: 5000,
    pupilScale: 1.0
  },
  [AtlasState.WORKING]: {
    state: AtlasState.WORKING,
    eyeType: 'spinner',
    primaryColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    pulseSpeedMs: 900,
    label: 'Executing action...',
    enableCursorTracking: false,
    blinkIntervalMs: 0,
    pupilScale: 1.0
  },
  [AtlasState.SPEAKING]: {
    state: AtlasState.SPEAKING,
    eyeType: 'waveform',
    primaryColor: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.5)',
    pulseSpeedMs: 700,
    label: 'Speaking...',
    enableCursorTracking: true,
    blinkIntervalMs: 4500,
    pupilScale: 1.15
  },
  [AtlasState.SUCCESS]: {
    state: AtlasState.SUCCESS,
    eyeType: 'stars',
    primaryColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.6)',
    pulseSpeedMs: 2000,
    label: 'Task completed!',
    enableCursorTracking: true,
    blinkIntervalMs: 3000,
    pupilScale: 1.25
  },
  [AtlasState.WARNING]: {
    state: AtlasState.WARNING,
    eyeType: 'warning',
    primaryColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    pulseSpeedMs: 1000,
    label: 'Attention needed',
    enableCursorTracking: true,
    blinkIntervalMs: 2500,
    pupilScale: 1.1
  },
  [AtlasState.ERROR]: {
    state: AtlasState.ERROR,
    eyeType: 'error',
    primaryColor: '#f87171',
    glowColor: 'rgba(248, 113, 113, 0.6)',
    pulseSpeedMs: 600,
    label: 'Error occurred',
    enableCursorTracking: false,
    blinkIntervalMs: 0,
    pupilScale: 0.85
  },
  [AtlasState.SLEEP]: {
    state: AtlasState.SLEEP,
    eyeType: 'closed',
    primaryColor: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.2)',
    pulseSpeedMs: 4000,
    label: 'Sleeping',
    enableCursorTracking: false,
    blinkIntervalMs: 0,
    pupilScale: 0.5
  },
  [AtlasState.EXCITED]: {
    state: AtlasState.EXCITED,
    eyeType: 'excited',
    primaryColor: '#e879f9',
    glowColor: 'rgba(232, 121, 249, 0.7)',
    pulseSpeedMs: 500,
    label: 'Excited!',
    enableCursorTracking: true,
    blinkIntervalMs: 2000,
    pupilScale: 1.3
  },
  [AtlasState.PAUSED]: {
    state: AtlasState.PAUSED,
    eyeType: 'paused',
    primaryColor: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    pulseSpeedMs: 2500,
    label: 'Paused',
    enableCursorTracking: false,
    blinkIntervalMs: 0,
    pupilScale: 1.0
  },
  [AtlasState.AWAITING_PERMISSION]: {
    state: AtlasState.AWAITING_PERMISSION,
    eyeType: 'lock',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    pulseSpeedMs: 1100,
    label: 'Awaiting permission',
    enableCursorTracking: true,
    blinkIntervalMs: 3000,
    pupilScale: 1.1
  }
};
