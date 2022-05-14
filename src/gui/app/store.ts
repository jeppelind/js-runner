import { atom, selector, selectorFamily } from 'recoil';

type Runner = {
  key: string,
  config: Record<string, unknown>
}

export const runnersState = atom({
  key: 'Runners',
  default: <Runner[]>[],
});

export const runnersSelector = selector({
  key: 'RunnersSelector',
  get: ({ get }) => get(runnersState),
  set: ({ set }, newValue: Runner | Runner[]) => set(
    runnersState,
    (prevState) => {
      if (Array.isArray(newValue)) {
        return newValue;
      }
      const newState = [...prevState];
      const runnerIdx = newState.findIndex((runner) => runner.key === newValue.key);
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
  get: (key: string) => ({ get }) => {
    const runners = get(runnersState);
    return runners.find((runner) => runner.key === key);
  },
});
