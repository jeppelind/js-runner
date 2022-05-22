import { app, BrowserWindow } from 'electron';
import { LogItem } from './logger/logger';
import emitter from './script-handler/eventEmitter';
import {
  exportRunner, exportRunners, initScripts, watchDir,
} from './script-handler/manager';

const initScriptHandler = () => {
  initScripts('./testdir');
  watchDir('./testdir');
};

const createWindow = () => {
  let clientReady = false;
  const logCue: LogItem[] = [];
  const win = new BrowserWindow({
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
  });
};

const initGUI = async () => {
  await app.whenReady();
  createWindow();
};

initScriptHandler();
initGUI();
