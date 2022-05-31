import { useSetRecoilState } from 'recoil';
import configState from '../app/config';
import { deleteRunnersSelector, setLogsSelector, setRunnersSelector } from '../app/store';

interface IElectron {
  ipcRenderer: {
    // eslint-disable-next-line no-undef
    on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[])
      => void) => void,
  },
}

declare global {
  interface Window {
    electron: IElectron,
  }
}

const APIListeners: () => any = () => {
  const setRunners = useSetRecoilState(setRunnersSelector);
  const deleteRunner = useSetRecoilState(deleteRunnersSelector);
  const setLog = useSetRecoilState(setLogsSelector);
  const setConfig = useSetRecoilState(configState);

  window.electron.ipcRenderer.on('runnerUpdated', (_, msg) => {
    setRunners(msg);
  });

  window.electron.ipcRenderer.on('runnerDeleted', (_, msg) => {
    deleteRunner(msg);
  });

  window.electron.ipcRenderer.on('runnerExecuted', (_, msg) => {
    setRunners(msg);
  });

  window.electron.ipcRenderer.on('logUpdated', (_, msg) => {
    setLog((currentState) => [msg, ...currentState]);
  });

  window.electron.ipcRenderer.on('config', (_, msg) => {
    setConfig(msg);
  });

  return null;
};

export default APIListeners;
