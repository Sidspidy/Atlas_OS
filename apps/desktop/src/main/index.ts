import { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, screen, dialog, desktopCapturer, nativeImage } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;
let companionWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let currentState: string = 'IDLE';
let companionPosition: { x: number; y: number } | null = null;

async function loadWindowUrl(win: BrowserWindow, url: string, hash: string = '') {
  const fullUrl = hash ? `${url}#${hash}` : url;
  try {
    await win.loadURL(fullUrl);
  } catch (err) {
    console.log(`[Atlas Electron] Dev server http://localhost:5173 not ready yet, retrying...`);
    setTimeout(async () => {
      try {
        await win.loadURL(fullUrl);
      } catch (retryErr) {
        // Fallback to compiled dist/index.html if available
        const indexPath = path.join(__dirname, '../index.html');
        if (win && !win.isDestroyed()) {
          win.loadFile(indexPath, { hash });
        }
      }
    }, 2000);
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#07090e',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devUrl = 'http://localhost:5173';
  loadWindowUrl(mainWindow, devUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createCompanionWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: workWidth, height: workHeight } = primaryDisplay.workArea;

  const defaultWidth = 320;
  const defaultHeight = 360;

  const defaultX = companionPosition ? companionPosition.x : workWidth - defaultWidth - 20;
  const defaultY = companionPosition ? companionPosition.y : 40;

  companionWindow = new BrowserWindow({
    width: defaultWidth,
    height: defaultHeight,
    x: defaultX,
    y: defaultY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devUrl = 'http://localhost:5173';
  loadWindowUrl(companionWindow, devUrl, 'companion');

  companionWindow.on('moved', () => {
    if (companionWindow) {
      const [x, y] = companionWindow.getPosition();
      companionPosition = { x, y };
    }
  });

  companionWindow.on('closed', () => {
    companionWindow = null;
  });
}

function createSystemTray() {
  // Create a 16x16 clean purple pixel image icon for the System Tray
  const iconBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSU5EUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABMSURBVHgB7ZHBDQAgCAM5j8N5HEZyG8hKjBq1PhL+XAJBAZCSzB3cTAYgM0l+Yt8nASB3oQAwM0mSZP31x4ACoACeY+8pAMoASZJ00wO4vAFqD9xVtgAAAABJRU5ErkJggg==',
    'base64'
  );
  const trayIcon = nativeImage.createFromBuffer(iconBuffer);

  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Atlas OS', click: () => { mainWindow?.show(); mainWindow?.focus(); } },
    { label: 'Ask Atlas', click: () => { mainWindow?.show(); mainWindow?.focus(); } },
    {
      label: 'Voice Mode',
      click: () => {
        currentState = 'LISTENING';
        mainWindow?.webContents.send('atlas:state-changed', currentState);
        companionWindow?.webContents.send('atlas:state-changed', currentState);
      }
    },
    { label: 'Toggle Companion', click: () => toggleCompanion() },
    {
      label: 'Pause Assistant',
      click: () => {
        currentState = 'PAUSED';
        mainWindow?.webContents.send('atlas:state-changed', currentState);
        companionWindow?.webContents.send('atlas:state-changed', currentState);
      }
    },
    { type: 'separator' },
    { label: 'Quit Atlas OS', click: () => app.quit() }
  ]);

  tray.setToolTip('Atlas OS — Your AI Companion');
  tray.setContextMenu(contextMenu);
}

function toggleCompanion() {
  if (companionWindow) {
    if (companionWindow.isVisible()) {
      companionWindow.hide();
    } else {
      companionWindow.show();
    }
  } else {
    createCompanionWindow();
  }
}

app.whenReady().then(() => {
  createMainWindow();
  createCompanionWindow();
  createSystemTray();

  // Register Global Shortcuts
  globalShortcut.register('CommandOrControl+Space', () => {
    if (mainWindow?.isFocused()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
      mainWindow?.focus();
    }
  });

  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    currentState = 'LISTENING';
    mainWindow?.webContents.send('atlas:state-changed', currentState);
    companionWindow?.webContents.send('atlas:state-changed', currentState);
    if (!companionWindow?.isVisible()) {
      companionWindow?.show();
    }
  });

  ipcMain.handle('atlas:set-state', (_event, state: string) => {
    currentState = state;
    mainWindow?.webContents.send('atlas:state-changed', state);
    companionWindow?.webContents.send('atlas:state-changed', state);
    return currentState;
  });

  ipcMain.handle('atlas:get-state', () => currentState);

  ipcMain.handle('atlas:toggle-companion', () => {
    toggleCompanion();
    return true;
  });

  ipcMain.handle('atlas:minimize-to-companion', () => {
    mainWindow?.hide();
    if (!companionWindow?.isVisible()) {
      companionWindow?.show();
    }
    return true;
  });

  ipcMain.handle('atlas:restore-main', () => {
    mainWindow?.show();
    mainWindow?.focus();
    return true;
  });

  ipcMain.handle('atlas:show-notification', (_event, notification) => {
    companionWindow?.webContents.send('atlas:notification', notification);
    if (!companionWindow?.isVisible()) {
      companionWindow?.show();
    }
    return true;
  });

  ipcMain.handle('atlas:update-companion-position', (_event, pos: { x: number; y: number }) => {
    companionPosition = pos;
    return true;
  });

  ipcMain.handle('atlas:select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory']
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });

  ipcMain.handle('atlas:index-directory', async (_event, directoryPath: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/files/index-directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directoryPath })
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Backend unreachable' };
    }
  });

  ipcMain.handle('atlas:get-indexed-files', async () => {
    try {
      const res = await fetch('http://localhost:3001/api/files/indexed');
      return await res.json();
    } catch (e) {
      return { files: [], directories: [] };
    }
  });

  ipcMain.handle('atlas:open-vscode', async (_event, payload) => {
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
  });

  ipcMain.handle('atlas:search-symbols', async (_event, query: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/code/symbols?query=${encodeURIComponent(query || '')}`);
      return await res.json();
    } catch (e) {
      return { success: false, symbols: [] };
    }
  });

  ipcMain.handle('atlas:detect-project', async (_event, targetPath: string) => {
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
  });

  ipcMain.handle('atlas:capture-screen', async () => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1280, height: 720 } });
      const primarySource = sources[0];
      if (primarySource) {
        return {
          success: true,
          dataUrl: primarySource.thumbnail.toDataURL(),
          name: primarySource.name
        };
      }
      return { success: false, error: 'No screen sources found' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Capture failed' };
    }
  });

  ipcMain.handle('atlas:analyze-vision', async (_event, imageDataUrl: string) => {
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
  });

  ipcMain.handle('atlas:health-check', async () => {
    try {
      const res = await fetch('http://localhost:3001/health');
      return await res.json();
    } catch (e) {
      return { status: 'degraded', services: { database: false, redis: false, gateway: false } };
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
