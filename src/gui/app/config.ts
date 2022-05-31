import { atom } from 'recoil';

type ConfigItem = {
  paths: {
    scriptdir: string,
    log: string,
  }
}

const configState = atom({
  key: 'Config',
  default: <ConfigItem>{},
});

export default configState;
