/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import vm, { Script } from 'vm';
import { Logger } from '../logger/logger';
import emitter from './eventEmitter';

type CustomObject = Record<string, unknown>;

type ScriptConfig = {
  enabled: boolean,
  runImmediately: boolean,
  repeatDelay: number,
  nodeAPI: string[],
  packages: string[],
}

type MetaData = {
  lastRun: number,
  successfulRuns: number,
  failedRuns: number,
  runHistory: string[],
}

type ScriptContext = {
  global: CustomObject,
  mem: CustomObject,
  logger: Logger,
}

const globalScriptObject = {};

const defaultScriptConfig: ScriptConfig = {
  enabled: true,
  runImmediately: true,
  repeatDelay: 0,
  nodeAPI: [],
  packages: [],
};

const defaultMetaData: MetaData = {
  lastRun: 0,
  successfulRuns: 0,
  failedRuns: 0,
  runHistory: [],
};

const defaultContext: ScriptContext = {
  global: globalScriptObject,
  mem: {},
  logger: null,
};

class Runner {
  #name: string;
  #script: Script;
  #timerID: NodeJS.Timeout;
  #config: ScriptConfig;
  #context: ScriptContext;
  #meta: MetaData;

  constructor(name: string) {
    this.#name = name;
    this.#context = { ...defaultContext, logger: new Logger({ script: name }) };
    this.#meta = { ...defaultMetaData };
    this.#config = { ...defaultScriptConfig };
  }

  set config(newConfig: ScriptConfig) {
    clearTimeout(this.#timerID);
    this.#config = { ...defaultScriptConfig, ...newConfig };

    const nodeAPIs: CustomObject = {};
    this.#config.nodeAPI.forEach((api) => {
      nodeAPIs[api] = require(api);
    });

    const packages: CustomObject = {};
    this.#config.packages.forEach((packageName) => {
      packages[packageName] = require(packageName);
    });

    this.#context = { ...this.#context, ...nodeAPIs, ...{ npm: packages } };

    if (this.#config.enabled && this.#config.repeatDelay > 0) {
      this.#setRepeatInterval(this.#config.repeatDelay);
    }
  }

  get config() {
    return { ...this.#config };
  }

  get meta() {
    return { ...this.#meta };
  }

  set code(code: string) {
    this.#script = new vm.Script(code);
    if (this.#config.enabled && this.#config.runImmediately) {
      this.#run();
    }
  }

  #setRepeatInterval(msDelay: number) {
    this.#timerID = setTimeout(() => {
      this.#run();
      this.#setRepeatInterval(msDelay);
    }, msDelay);
  }

  #run() {
    if (Date.now() - this.#meta.lastRun < 10) {
      return;
    }

    this.#meta.lastRun = Date.now();
    const newContext = { ...this.#context };
    try {
      this.#script.runInNewContext(newContext);
      this.#meta.successfulRuns += 1;
    } catch (err) {
      this.#context.logger.error(err);
      this.#meta.failedRuns += 1;
    }
    emitter.emit('runnerExecuted', this.#name);
  }
}

export default Runner;
