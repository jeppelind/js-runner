/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <div>Hello Mongo!</div>;

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);

interface IElectron {
  // eslint-disable-next-line no-undef
  ipcRenderer: {
    on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void,
  },
}

declare global {
  interface Window {
    electron: IElectron,
  }
}

window.electron.ipcRenderer.on('bazooka', (_, msg) => {
  console.dir(msg);
});
