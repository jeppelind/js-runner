/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import vm, { Script } from 'vm';

type CustomObject = Record<string, unknown>;

type ScriptConfig = {
  runImmediately: boolean,
  repeatDelay: number,
  nodeAPI: string[]
}

type ScriptContext = {
  global: CustomObject,
}

const defaultScriptConfig: ScriptConfig = {
  runImmediately: true,
  repeatDelay: 0,
  nodeAPI: [],
};

const defaultContext: ScriptContext = {
  global: {},
};

class Runner {
  #name: string;
  #script: Script;
  #timerID: NodeJS.Timeout;
  #config: ScriptConfig;
  #context: ScriptContext;

  constructor(name: string) {
    this.#name = name;
    this.#context = { ...defaultContext };
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

    if (this.#config.repeatDelay > 0) {
      this.#setRepeatInterval(this.#config.repeatDelay);
    }
  }

  set code(code: string) {
    this.#script = new vm.Script(code);
    if (this.#config.runImmediately) {
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
    const newContext = { ...this.#context };
    try {
      this.#script.runInNewContext(newContext);
    } catch (err) {
      console.log(`Error in file: ${this.#name}:`);
      console.error(err);
    }
  }
}

export default Runner;
