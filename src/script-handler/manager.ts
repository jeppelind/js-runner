import { watch } from 'fs';
import { readdir, readFile } from 'fs/promises';
import Runner from './runner';

const runners = new Map<string, Runner>();

const backslashToFrontslash = (pathname: string) => pathname.replaceAll('\\', '/');

const setRunnerConfig = async (filename: string) => {
  const nameWithoutExtension = backslashToFrontslash(filename.substring(0, filename.lastIndexOf('.')));
  const scriptName = `${nameWithoutExtension}.js`;
  const configName = `${nameWithoutExtension}.json`;
  if (!runners.has(scriptName)) {
    console.log(`Runner "${scriptName}" not found.`);
    return;
  }
  try {
    const userConfig = await readFile(configName, { encoding: 'utf8' });
    const runner = runners.get(scriptName);
    runner.config = JSON.parse(userConfig);
  } catch (err) {
    console.error(err.message);
  }
};

const setupRunner = async (filename: string) => {
  const pathname = backslashToFrontslash(filename);
  try {
    const code = await readFile(pathname, { encoding: 'utf8' });
    let script: Runner;
    if (runners.has(pathname)) {
      script = runners.get(pathname);
    } else {
      script = new Runner(pathname);
      runners.set(pathname, script);
      await setRunnerConfig(pathname);
    }
    script.code = code;
  } catch (err) {
    if (err.code === 'ENOENT') {
      runners.delete(pathname);
    } else {
      console.error(err.message);
    }
  }
};

export const initScripts = async (dir: string) => {
  try {
    const files = await readdir(dir, { withFileTypes: true });
    files.forEach((file) => {
      if (file.isDirectory()) {
        initScripts(`${dir}/${file.name}`);
      } else if (file.name.endsWith('.js')) {
        setupRunner(`${dir}/${file.name}`);
      } else if (file.name.endsWith('.json')) {
        setRunnerConfig(`${dir}/${file.name}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

export const watchDir = async (dir: string) => {
  watch(dir, { recursive: true }, async (_, filename) => {
    if (filename && filename.endsWith('.js')) {
      setupRunner(`${dir}/${filename}`);
    } else if (filename && filename.endsWith('.json')) {
      setRunnerConfig(`${dir}/${filename}`);
    }
  });
};
