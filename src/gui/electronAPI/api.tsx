/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { runnersState } from '../app/store';

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
  const setRunners = useSetRecoilState(runnersState);

  window.electron.ipcRenderer.on('bazooka', (_, msg) => {
    console.dir(msg);
    setRunners((oldState) => [...oldState, ...msg]);
  });
  return null;
};

export default APIListeners;
