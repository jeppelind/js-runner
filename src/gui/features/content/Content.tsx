import React, { useState } from 'react';
import { Stack } from 'react-bootstrap';
import RunnerMenu from '../menu/RunnerMenu';
import RunnerInfo from '../runner/RunnerInfo';
import './Content.scss';

const Content = () => {
  const [selectedRunner, setSelectedRunner] = useState('');

  const selectRunner = (id: string) => {
    setSelectedRunner(id);
  };

  return (
    <Stack className='main-content' direction='horizontal'>
      <RunnerMenu onSelectItem={selectRunner} />
      <RunnerInfo id={selectedRunner} />
    </Stack>
  );
};

export default Content;
