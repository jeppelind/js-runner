/* eslint-disable max-len */
// import { createHmac } from 'crypto';
import { Dirent, ObjectEncodingOptions, PathLike } from 'fs';
import React from 'react';
import { createRoot } from 'react-dom/client';
// import { watchDir } from './electronAPI/handler';

const App = () => <div>Hello Mongo!</div>;

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);

// const secret = 'abcdefg';
// const hmac = createHmac('sha256', secret);
// hmac.update('I like cupcakes');
// const hash = hmac.digest('hex');
// console.log(hash);

// readDir('Y:/dev/js-runner/testdir');
// watchDir('Y:/dev/js-runner/testdir');

// type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';

interface IElectron {
  // eslint-disable-next-line no-unused-vars
  readdir: (dir: string) => Promise<Dirent[]>,
  // eslint-disable-next-line no-unused-vars
  readdir2: (path: PathLike, options: ObjectEncodingOptions & {
    withFileTypes: true;
  }) => Promise<Dirent[]>
}

declare global {
  interface Window {
    electron: IElectron,
  }
}

const readDir = async (dir: string) => {
  // const files = await window.electron.readdir(dir);
  const files = await window.electron.readdir2(dir, { withFileTypes: true });
  files.forEach((file) => {
    console.log(file.name);
    console.log(file);
    if (file.isDirectory()) {
      readDir(`${dir}/${file.name}`);
    } else {
      console.log(file.name);
    }
  });
};
readDir('Y:/dev/js-runner/testdir');
