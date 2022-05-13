import React from 'react';
import { useRecoilValue } from 'recoil';
import { runnersState } from '../../app/store';

const Dashboard = () => {
  const runners = useRecoilValue(runnersState);

  return <div>Runners: {runners.length}</div>;
};

export default Dashboard;
