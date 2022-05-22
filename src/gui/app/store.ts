import { atom, selector, selectorFamily } from 'recoil';

export type Runner = {
  id: string,
  config: {
    enabled: boolean,
    runImmediately: boolean,
    repeatDelay: number,
    nodeAPI: string[],
  },
  meta: {
    lastRun: number,
    successfulRuns: number,
    failedRuns: number,
    runHistory: string[],
  }
}

const runnersState = atom({
  key: 'Runners',
  default: <Runner[]>[],
});

export const runnerIdsSelector = selector({
  key: 'RunnerIdsSelector',
  get: ({ get }) => {
    const runners = get(runnersState);
    return runners.map((runner) => runner.id);
  },
});

export const runnersSelector = selector({
  key: 'RunnersSelector',
  get: ({ get }) => {
    const runners = get(runnersState);
    const activeRunners = runners.filter((runner) => runner.config.enabled === true);
    const inactiveRunners = runners.filter((runner) => runner.config.enabled === false);

    return {
      runners,
      activeRunners,
      inactiveRunners,
    };
  },
});

export const setRunnersSelector = selector({
  key: 'SetRunnersSelector',
  get: ({ get }) => get(runnersState),
  set: ({ set }, newValue: Runner | Runner[]) => set(
    runnersState,
    (prevState) => {
      if (Array.isArray(newValue)) {
        return newValue;
      }
      const newState = [...prevState];
      const runnerIdx = newState.findIndex((runner) => runner.id === newValue.id);
      if (runnerIdx === -1) {
        newState.push(newValue);
      } else {
        newState[runnerIdx] = { ...newValue };
      }
      return newState;
    },
  ),
});

export const deleteRunnersSelector = selector({
  key: 'DeleteRunnersSelector',
  get: ({ get }) => get(runnersState),
  set: ({ set }, newValue: string | Runner[]) => set(
    runnersState,
    (prevState) => {
      const newState = [...prevState];
      const runnerIdx = newState.findIndex((runner) => runner.id === newValue);
      if (runnerIdx > -1) {
        newState.splice(runnerIdx, 1);
      }
      return newState;
    },
  ),
});

export const runnerSelector = selectorFamily({
  key: 'RunnerSelector',
  get: (id: string) => ({ get }) => {
    const runners = get(runnersState);
    return runners.find((runner) => runner.id === id);
  },
});

type LogItem = {
  id: string,
  msg: string,
  level: string,
  time: number,
  meta: {
    script: string,
  },
}

const logsState = atom({
  key: 'Logs',
  default: <LogItem[]>[],
});

export const logsSelector = selector({
  key: 'LogsSelector',
  get: ({ get }) => {
    const logs = get(logsState);
    const errors = logs.filter((log) => log.level === 'error');
    const logIds = logs.map((log) => log.id);

    return {
      logs,
      errors,
      logIds,
    };
  },
});

export const logByIdSelector = selectorFamily({
  key: 'LogByIdSelector',
  get: (id: string) => ({ get }) => {
    const logs = get(logsState);
    return logs.find((log) => log.id === id);
  },
});

export const setLogsSelector = selector({
  key: 'SetLogsSelector',
  get: ({ get }) => get(logsState),
  set: ({ set }, newValue: LogItem[]) => set(
    logsState,
    () => {
      if (newValue.length > 100) {
        newValue.pop();
      }
      return newValue;
    },
  ),
});
