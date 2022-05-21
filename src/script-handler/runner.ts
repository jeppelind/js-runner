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
  nodeAPI: string[]
}

type MetaData = {
  lastRun: number,
  successfulRuns: number,
  failedRuns: number,
  runHistory: string[],
}

type ScriptContext = {
  global: CustomObject,
  logger: Logger,
}

const defaultScriptConfig: ScriptConfig = {
  enabled: true,
  runImmediately: true,
  repeatDelay: 0,
  nodeAPI: [],
};

const defaultMetaData: MetaData = {
  lastRun: 0,
  successfulRuns: 0,
  failedRuns: 0,
  runHistory: [],
};

const defaultContext: ScriptContext = {
  global: {},
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

    this.#context = { ...this.#context, ...nodeAPIs };

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
