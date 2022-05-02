import { initScripts, watchDir } from './script-handler/manager';

const initScriptHandler = () => {
  initScripts('./testdir');
  watchDir('./testdir');
};

initScriptHandler();
