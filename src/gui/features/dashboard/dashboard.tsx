import React from 'react';
import { useRecoilValue } from 'recoil';
import { runnerSelector, runnersState } from '../../app/store';

type RunnerItemProps = {
  id: string,
};

const RunnerItem = ({ id }: RunnerItemProps) => {
  const runner = useRecoilValue(runnerSelector(id));

  return (
    <div>
      <h3>{runner.key}</h3>
      <p>{`Repeat interval ${runner.config.repeatDelay}`}</p>
    </div>
  );
};

const Dashboard = () => {
  const runners = useRecoilValue(runnersState);

  return (
    <>
      <div>Runners: {runners.length}</div>
      {
        runners.map((runner) => <RunnerItem key={runner.key} id={runner.key} />)
      }
    </>
  );
};

export default Dashboard;
