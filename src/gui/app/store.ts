import { atom, selector, selectorFamily } from 'recoil';

type Runner = {
  id: string,
  config: Record<string, unknown>
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

export const runnerSelector = selectorFamily({
  key: 'RunnerSelector',
  get: (id: string) => ({ get }) => {
    const runners = get(runnersState);
    return runners.find((runner) => runner.id === id);
  },
});
