import {
  app, BrowserWindow, Menu, nativeImage, Tray,
} from 'electron';
import { readFileSync } from 'fs';
import ini from 'ini';
import { LogItem } from './logger/logger';
import emitter from './script-handler/eventEmitter';
import {
  exportRunner, exportRunners, initScripts, watchDir,
} from './script-handler/manager';

const config = ini.parse(readFileSync('./jsrunner.ini', 'utf-8'));
config.appLocation = __dirname;

const initScriptHandler = () => {
  initScripts(config.paths.scriptdir);
  watchDir(config.paths.scriptdir);
};

const createWindow = () => {
  const win = new BrowserWindow({
    title: 'JS Runner',
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1b1b20',
      symbolColor: '#74b1be',
    },
    webPreferences: {
      preload: `${__dirname}/preload.js`,
    },
  });
  win.loadFile('./gui/index.html');

  return win;
};

const initEventListeners = (win: BrowserWindow) => {
  let clientReady = false;
  const logCue: LogItem[] = [];

  emitter.on('runnerExecuted', (msg) => {
    const runner = exportRunner(msg);
    win.webContents.send('runnerExecuted', runner);
  });

  emitter.on('runnerUpdated', (msg) => {
    const runner = exportRunner(msg);
    win.webContents.send('runnerUpdated', runner);
  });

  emitter.on('runnerDeleted', (msg) => {
    win.webContents.send('runnerDeleted', msg);
  });

  emitter.on('logUpdated', (msg: LogItem) => {
    if (clientReady) {
      win.webContents.send('logUpdated', msg);
    } else {
      logCue.push(msg);
    }
  });

  win.webContents.on('did-finish-load', () => {
    clientReady = true;
    const runnerConfigs = exportRunners();
    runnerConfigs.map((runner) => win.webContents.send('runnerUpdated', runner));
    logCue.map((msg) => win.webContents.send('logUpdated', msg));
    win.webContents.send('config', config);
  });
};

const createTrayIcon = (win: BrowserWindow) => {
  const icon = nativeImage.createFromPath(`${__dirname}/gui/static/icon32.png`);
  const tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => win.show() },
    { label: 'Minimize', click: () => win.hide() },
    { type: 'separator' },
    { label: 'Exit', click: () => app.exit(0) },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('JS Runner');
};

const initGUI = async () => {
  await app.whenReady();
  const win = createWindow();
  initEventListeners(win);
  createTrayIcon(win);
};

initScriptHandler();
if (process.env.DISPLAY_MODE !== 'backend') {
  initGUI();
}
