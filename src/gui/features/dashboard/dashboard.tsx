import React, { useState } from 'react';
import { Row, Stack } from 'react-bootstrap';
import RunnerMenu from '../menu/RunnerMenu';
import './Dashboard.scss';

const Dashboard = () => {
  const [selectedRunner, setSelectedRunner] = useState('');

  const selectRunner = (id: string) => {
    setSelectedRunner(id);
  };

  return (
    <Stack className='main-content' direction='horizontal'>
      <RunnerMenu selectMenuItem={selectRunner} />
      <Row>
        <h3>Selected runner: {selectedRunner}</h3>
      </Row>
      {/* <Row>
        {
          runnerIds.map((id) => <RunnerItem key={id} id={id} />)
        }
      </Row> */}
    </Stack>
  );
};

export default Dashboard;
