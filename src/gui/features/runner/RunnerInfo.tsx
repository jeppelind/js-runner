import React from 'react';
import {
  Alert, Col, Container, Row,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import configState from '../../app/config';
import { runnerSelector } from '../../app/store';
import './Runner.scss';
import RunnerConfig from './RunnerConfig';
import RunnerLogs from './RunnerLogs';
import RunnerStatus from './RunnerStatus';

const RunnerInfo = ({ id }: { id: string }) => {
  const runner = useRecoilValue(runnerSelector(id));
  const config = useRecoilValue(configState);

  if (id === '') {
    return (
      <Container className='ms-4 scrollwrap'>
        <h6 className='dash-heading'>SETTINGS</h6>
        <Row className='justify-content-md-left'>
          <Col>
            <span className='label'>Scripts source</span>
            <p>{config.paths && config.paths.scriptdir}</p>
          </Col>
          <Col>
            <span className='label'>Log output</span>
            <p>{config.paths && config.paths.log}</p>
          </Col>
        </Row>
        <br />
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
