import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@atlas-os/ui/styles/theme.css';

// Web Fallback Bridge for running directly in standard Web Browsers (Chrome / Firefox / Edge)
if (!window.atlasAPI) {
  let mockState = 'IDLE';
  const stateCallbacks: ((state: string) => void)[] = [];
  const notifCallbacks: ((notif: any) => void)[] = [];

  (window as any).atlasAPI = {
    setState: async (state: string) => {
      mockState = state;
      stateCallbacks.forEach((cb) => cb(state));
    },
    getState: async () => mockState,
    toggleCompanion: async () => {},
    minimizeToCompanion: async () => {},
    restoreMain: async () => {},
    getHealth: async () => {
      try {
        const res = await fetch('http://localhost:3001/health');
        return await res.json();
      } catch (e) {
        return { status: 'degraded', services: { database: false, redis: false, gateway: false } };
      }
    },
    showNotification: async (notification: any) => {
      notifCallbacks.forEach((cb) => cb(notification));
    },
    updateCompanionPosition: async () => {},
    selectDirectory: async () => {
      const path = prompt('Enter workspace directory path:', 'e:/my_projects');
      return path || 'e:/my_projects';
    },
    indexDirectory: async (dirPath: string) => {
      try {
        const res = await fetch('http://localhost:3001/api/files/index-directory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ directoryPath: dirPath })
        });
        return await res.json();
      } catch (e) {
        return { success: false, error: 'Backend unreachable' };
      }
    },
    getIndexedFiles: async () => {
      try {
        const res = await fetch('http://localhost:3001/api/files/indexed');
        return await res.json();
      } catch (e) {
        return { files: [], directories: [] };
      }
    },
    openVSCode: async (payload: any) => {
      try {
        const res = await fetch('http://localhost:3001/api/code/open-vscode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload || {})
        });
        return await res.json();
      } catch (e) {
        return { success: false, error: 'Backend unreachable' };
      }
    },
    searchSymbols: async (query: string) => {
      try {
        const res = await fetch(`http://localhost:3001/api/code/symbols?query=${encodeURIComponent(query || '')}`);
        return await res.json();
      } catch (e) {
        return { success: false, symbols: [] };
      }
    },
    detectProject: async (targetPath?: string) => {
      try {
        const res = await fetch('http://localhost:3001/api/code/detect-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetPath: targetPath || 'e:/my_projects' })
        });
        return await res.json();
      } catch (e) {
        return { success: false, metadata: null };
      }
    },
    captureScreen: async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          const video = document.createElement('video');
          video.srcObject = stream;
          await video.play();

          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

          stream.getTracks().forEach((track) => track.stop());
          return { success: true, dataUrl: canvas.toDataURL('image/png'), name: 'Web Browser Capture' };
        }
      } catch (e) {
        // Fallback to sample screen mock payload
      }
      return {
        success: true,
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%230d111a"/><text x="400" y="225" fill="%2338bdf8" font-size="20" text-anchor="middle" font-family="sans-serif">Atlas OS Screen Snapshot</text></svg>',
        name: 'Simulated Desktop Snapshot'
      };
    },
    analyzeVision: async (imageDataUrl: string) => {
      try {
        const res = await fetch('http://localhost:3001/api/vision/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageDataUrl })
        });
        return await res.json();
      } catch (e) {
        return { success: false, error: 'Backend unreachable' };
      }
    },
    onStateChanged: (callback: (state: string) => void) => {
      stateCallbacks.push(callback);
    },
    onNotificationReceived: (callback: (notification: any) => void) => {
      notifCallbacks.push(callback);
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
