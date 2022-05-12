import { contextBridge, ipcRenderer } from 'electron';
import { watch } from 'fs';
import { readdir } from 'fs/promises';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (eventName: string, callback: any) => {
      ipcRenderer.on(eventName, callback);
    },
  },
});
