import React from 'react';
import {
  Alert, Badge, Col, Container, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { runnerSelector } from '../../app/store';
import './Runner.scss';

const TooltipLabel = ({ label, tooltip }: { label: string, tooltip: string }) => (
  <OverlayTrigger
    key={label}
    overlay={
      <Tooltip>{tooltip}</Tooltip>
    }
  >
    <span className='label'>{label}</span>
  </OverlayTrigger>
);

const RunnerInfo = ({ id }: { id: string }) => {
  const runner = useRecoilValue(runnerSelector(id));

  const displayBool = (value: boolean) => {
    if (value) {
      return <Badge bg='success'>True</Badge>;
    }
    return <Badge bg='danger'>False</Badge>;
  };

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
      <h6 className='dash-heading'>CONFIG</h6>
      <Row className='justify-content-md-left'>
        <Col>
          <span className='label'>File</span>
          <p>{runner.id}</p>
        </Col>
        <Col>
        <span className='label'>enabled</span>
          <p>{displayBool(runner.config.enabled)}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <TooltipLabel label='repeatDelay' tooltip='Run script every given millisecond (disabled when 0)' />
          <p>{runner.config.repeatDelay} <small>ms</small></p>
        </Col>
        <Col>
          <TooltipLabel label='runImmediately' tooltip='Run script as soon as it is parsed' />
          <p>{displayBool(runner.config.runImmediately)}</p>
        </Col>
      </Row>
      <Row>
      <span className='label'>nodeAPI</span>
        <p>
        {
          runner.config.nodeAPI.map((api) => <><Badge bg='primary'>{api}</Badge>{' '}</>)
        }
        </p>
      </Row>
      <h6 className='dash-heading'>STATUS</h6>
    </Container>
  );
};

export default RunnerInfo;
