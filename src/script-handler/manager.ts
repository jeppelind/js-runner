import { watch } from 'fs';
import { readdir, readFile } from 'fs/promises';
import logger from '../logger/logger';
import emitter from './eventEmitter';
import Runner from './runner';

const runners = new Map<string, Runner>();

const backslashToFrontslash = (pathname: string) => pathname.replaceAll('\\', '/');

const setRunnerConfig = async (filename: string) => {
  const nameWithoutExtension = backslashToFrontslash(filename.substring(0, filename.lastIndexOf('.')));
  const scriptName = `${nameWithoutExtension}.js`;
  const configName = `${nameWithoutExtension}.json`;
  if (!runners.has(scriptName)) {
    return;
  }
  try {
    const userConfig = await readFile(configName, { encoding: 'utf8' });
    const runner = runners.get(scriptName);
    runner.config = JSON.parse(userConfig);
    emitter.emit('runnerUpdated', scriptName);
  } catch (err) {
    logger.warn(err.message);
  }
};

const setupRunner = async (filename: string) => {
  const pathname = backslashToFrontslash(filename);
  try {
    const code = await readFile(pathname, { encoding: 'utf8' });
    let runner: Runner;
    if (runners.has(pathname)) {
      runner = runners.get(pathname);
    } else {
      runner = new Runner(pathname);
      runners.set(pathname, runner);
      await setRunnerConfig(pathname);
    }
    runner.code = code;
  } catch (err) {
    if (err.code === 'ENOENT') {
      runners.delete(pathname);
      logger.log(`Deleted ${pathname}`);
      emitter.emit('runnerDeleted', pathname);
    } else {
      logger.error(err.message);
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
    logger.error(err);
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

export const exportRunner = (key: string) => {
  if (runners.has(key)) {
    const runner = runners.get(key);
    return { id: key, config: runner.config, meta: runner.meta };
  }
  return null;
};

export const exportRunners = () => {
  const output: { id: string, config: any, meta: any }[] = [];
  runners.forEach((value, key) => {
    output.push({ id: key, config: value.config, meta: value.meta });
  });
  return output;
};
