import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on: (eventName: string, callback: any) => {
      ipcRenderer.on(eventName, callback);
    },
  },
});
