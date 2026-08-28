import { contextBridge, ipcRenderer } from 'electron';

export interface AtlasAPI {
  setState: (state: string) => Promise<void>;
  getState: () => Promise<string>;
  toggleCompanion: () => Promise<void>;
  minimizeToCompanion: () => Promise<void>;
  restoreMain: () => Promise<void>;
  getHealth: () => Promise<any>;
  showNotification: (notification: {
    title: string;
    message: string;
    actions?: { label: string; actionId: string }[];
    type?: 'info' | 'warning' | 'success' | 'error';
  }) => Promise<void>;
  updateCompanionPosition: (pos: { x: number; y: number }) => Promise<void>;
  selectDirectory: () => Promise<string | null>;
  indexDirectory: (dirPath: string) => Promise<any>;
  getIndexedFiles: () => Promise<any>;
  openVSCode: (payload: { filePath?: string; line?: number; projectRoot?: string }) => Promise<any>;
  searchSymbols: (query: string) => Promise<any>;
  detectProject: (targetPath?: string) => Promise<any>;
  captureScreen: () => Promise<any>;
  analyzeVision: (imageDataUrl: string) => Promise<any>;
  onStateChanged: (callback: (state: string) => void) => void;
  onNotificationReceived: (callback: (notification: any) => void) => void;
}

const atlasAPI: AtlasAPI = {
  setState: (state: string) => ipcRenderer.invoke('atlas:set-state', state),
  getState: () => ipcRenderer.invoke('atlas:get-state'),
  toggleCompanion: () => ipcRenderer.invoke('atlas:toggle-companion'),
  minimizeToCompanion: () => ipcRenderer.invoke('atlas:minimize-to-companion'),
  restoreMain: () => ipcRenderer.invoke('atlas:restore-main'),
  getHealth: () => ipcRenderer.invoke('atlas:health-check'),
  showNotification: (notification) => ipcRenderer.invoke('atlas:show-notification', notification),
  updateCompanionPosition: (pos) => ipcRenderer.invoke('atlas:update-companion-position', pos),
  selectDirectory: () => ipcRenderer.invoke('atlas:select-directory'),
  indexDirectory: (dirPath: string) => ipcRenderer.invoke('atlas:index-directory', dirPath),
  getIndexedFiles: () => ipcRenderer.invoke('atlas:get-indexed-files'),
  openVSCode: (payload) => ipcRenderer.invoke('atlas:open-vscode', payload),
  searchSymbols: (query) => ipcRenderer.invoke('atlas:search-symbols', query),
  detectProject: (targetPath) => ipcRenderer.invoke('atlas:detect-project', targetPath),
  captureScreen: () => ipcRenderer.invoke('atlas:capture-screen'),
  analyzeVision: (imageDataUrl) => ipcRenderer.invoke('atlas:analyze-vision', imageDataUrl),
  onStateChanged: (callback) => {
    ipcRenderer.on('atlas:state-changed', (_event, state) => callback(state));
  },
  onNotificationReceived: (callback) => {
    ipcRenderer.on('atlas:notification', (_event, notification) => callback(notification));
  }
};

contextBridge.exposeInMainWorld('atlasAPI', atlasAPI);
