/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { setLogsSelector, setRunnersSelector } from '../app/store';

interface IElectron {
  ipcRenderer: {
    on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void,
  },
}

declare global {
  interface Window {
    electron: IElectron,
  }
}

const APIListeners: () => any = () => {
  const setRunners = useSetRecoilState(setRunnersSelector);
  const setLog = useSetRecoilState(setLogsSelector);

  window.electron.ipcRenderer.on('runnerList', (_, msg) => {
    setRunners(msg);
  });

  window.electron.ipcRenderer.on('runnerUpdated', (_, msg) => {
    setRunners(msg);
  });

  window.electron.ipcRenderer.on('runnerExecuted', (_, msg) => {
    setRunners(msg);
  });

  window.electron.ipcRenderer.on('logUpdated', (_, msg) => {
    setLog((currentState) => [msg, ...currentState]);
  });

  return null;
};

export default APIListeners;
