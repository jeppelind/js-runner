import React from 'react';
import { useRecoilValue } from 'recoil';
import { runnerIdsSelector, runnerSelector } from '../../app/store';

type RunnerItemProps = {
  id: string,
};

const RunnerItem = ({ id }: RunnerItemProps) => {
  const runner = useRecoilValue(runnerSelector(id));

  return (
    <div>
      <h3>{runner.id}</h3>
      <p>{`Repeat interval ${runner.config.repeatDelay}`}</p>
    </div>
  );
};

const Dashboard = () => {
  const runnerIds = useRecoilValue(runnerIdsSelector);

  return (
    <>
      <div>Runners: {runnerIds.length}</div>
      {
        runnerIds.map((id) => <RunnerItem key={id} id={id} />)
      }
    </>
  );
};

export default Dashboard;
