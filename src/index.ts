import { app, BrowserWindow } from 'electron';
import emitter from './script-handler/eventEmitter';
import {
  exportRunner, exportRunners, initScripts, watchDir,
} from './script-handler/manager';

const initScriptHandler = () => {
  initScripts('./testdir');
  watchDir('./testdir');
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      // nodeIntegration: true,
    },
  });
  win.loadFile('./gui/index.html');
  emitter.on('runnerUpdated', (msg) => {
    const runner = exportRunner(msg);
    win.webContents.send('runnerUpdated', runner);
  });

  win.webContents.on('did-finish-load', () => {
    const runnerConfigs = exportRunners();
    win.webContents.send('runnerList', runnerConfigs);
  });
};

const initGUI = async () => {
  await app.whenReady();
  createWindow();
};

initScriptHandler();
initGUI();
