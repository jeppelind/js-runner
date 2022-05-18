import React from 'react';
import {
  Badge, Col, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { Runner } from '../../app/store';

type RunnerConfigProps = {
  id: string,
  config: Runner['config'],
}

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

const RunnerConfig = ({ id, config }: RunnerConfigProps) => {
  const displayBool = (value: boolean) => {
    if (value) {
      return <Badge bg='success'>True</Badge>;
    }
    return <Badge bg='danger'>False</Badge>;
  };

  return (
    <>
      <h6 className='dash-heading'>CONFIG</h6>
      <Row className='justify-content-md-left'>
        <Col>
          <span className='label'>File</span>
          <p>{id}</p>
        </Col>
        <Col>
          <span className='label'>enabled</span>
          <p>{displayBool(config.enabled)}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <TooltipLabel label='repeatDelay' tooltip='Run script every given millisecond (disabled when 0)' />
          <p>{config.repeatDelay} <small>ms</small></p>
        </Col>
        <Col>
          <TooltipLabel label='runImmediately' tooltip='Run script as soon as it is parsed' />
          <p>{displayBool(config.runImmediately)}</p>
        </Col>
      </Row>
      <Row>
      <span className='label'>nodeAPI</span>
        <p>
        {
          config.nodeAPI.map((api) => <><Badge key={id} bg='primary'>{api}</Badge>{' '}</>)
        }
        </p>
      </Row>
    </>
  );
};

export default RunnerConfig;
