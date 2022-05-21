import React from 'react';
import { Alert, Container } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { runnerSelector } from '../../app/store';
import './Runner.scss';
import RunnerConfig from './RunnerConfig';
import RunnerLogs from './RunnerLogs';
import RunnerStatus from './RunnerStatus';

const RunnerInfo = ({ id }: { id: string }) => {
  const runner = useRecoilValue(runnerSelector(id));

  if (id === '') {
    return (
      <Container className='ms-4 scrollwrap' fluid>
        <RunnerLogs />
      </Container>
    );
  }

  if (!runner) {
    return (
      <Container fluid>
        <Alert variant='danger'>
          <Alert.Heading>No data found</Alert.Heading>
          <p>Could not find any data for runner "{id}".</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className='mt-4 ms-4'>
      <h1 className='display-3'>{runner.id.substring(runner.id.lastIndexOf('/') + 1)}</h1>
      <br />
      <RunnerConfig id={runner.id} config={runner.config} />
      <br />
      <RunnerStatus meta={runner.meta} />
    </Container>
  );
};

export default RunnerInfo;
