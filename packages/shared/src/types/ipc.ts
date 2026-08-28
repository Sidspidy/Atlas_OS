export enum IPCChannel {
  SET_STATE = 'atlas:set-state',
  GET_STATE = 'atlas:get-state',
  TOGGLE_COMPANION = 'atlas:toggle-companion',
  MINIMIZE_TO_COMPANION = 'atlas:minimize-to-companion',
  RESTORE_MAIN = 'atlas:restore-main',
  EXECUTE_COMMAND = 'atlas:execute-command',
  HEALTH_CHECK = 'atlas:health-check',
  SHOW_NOTIFICATION = 'atlas:show-notification',
  UPDATE_COMPANION_POSITION = 'atlas:update-companion-position',
  SELECT_DIRECTORY = 'atlas:select-directory',
  INDEX_DIRECTORY = 'atlas:index-directory',
  GET_INDEXED_FILES = 'atlas:get-indexed-files',
  OPEN_VSCODE = 'atlas:open-vscode',
  SEARCH_SYMBOLS = 'atlas:search-symbols',
  DETECT_PROJECT = 'atlas:detect-project',
  RUN_TERMINAL_COMMAND = 'atlas:run-terminal-command',
  KILL_PROCESS = 'atlas:kill-process',
  PERMISSION_RESPONSE = 'atlas:permission-response',
  START_VOICE_LISTENING = 'atlas:start-voice-listening',
  STOP_VOICE_LISTENING = 'atlas:stop-voice-listening',
  SYNTHESIZE_SPEECH = 'atlas:synthesize-speech',
  CAPTURE_SCREEN = 'atlas:capture-screen',
  ANALYZE_VISION = 'atlas:analyze-vision',
  EXECUTE_AGENT_PLAN = 'atlas:execute-agent-plan',
  GET_AGENT_STATUS = 'atlas:get-agent-status',
  TRIGGER_WORKFLOW = 'atlas:trigger-workflow',
  GET_WORKFLOWS = 'atlas:get-workflows',
  EMIT_PROACTIVE_SUGGESTION = 'atlas:emit-proactive-suggestion',
  GET_PROACTIVE_SUMMARY = 'atlas:get-proactive-summary',
  GET_INTEGRATIONS = 'atlas:get-integrations',
  CONNECT_INTEGRATION = 'atlas:connect-integration',
  GET_OBSERVABILITY_SUMMARY = 'atlas:get-observability-summary',
  GET_AGENT_TRACES = 'atlas:get-agent-traces',
  GET_SECURITY_AUDIT = 'atlas:get-security-audit',
  STORE_CREDENTIAL = 'atlas:store-credential'
}

export interface SystemHealthResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  services: {
    database: boolean;
    redis: boolean;
    gateway: boolean;
  };
}

export interface CompanionNotificationPayload {
  id: string;
  title: string;
  message: string;
  actions?: { label: string; actionId: string }[];
  type?: 'info' | 'warning' | 'success' | 'error';
  timeoutMs?: number;
}
