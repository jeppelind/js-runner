import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Runner } from '../../app/store';

type RunnerStatusProps = {
  meta: Runner['meta'],
}

const RunnerStatus = ({ meta }: RunnerStatusProps) => {
  const getSuccessClass = (successRate: number) => {
    if (successRate < 20) {
      return 'success-danger';
    }
    if (successRate < 50) {
      return 'success-warn';
    }
    return '';
  };

  const getSuccessRate = () => {
    const totalRuns = meta.successfulRuns + meta.failedRuns;
    if (totalRuns === 0) {
      return <>N/A</>;
    }
    if (meta.failedRuns === 0) {
      return <>100<small>%</small></>;
    }
    const successRate = 100 - Math.round((meta.failedRuns / totalRuns) * 100);
    return <span className={getSuccessClass(successRate)}>{successRate}<small>%</small></span>;
  };

  return (
    <>
      <h6 className='dash-heading'>STATUS</h6>
      <Row>
        <span className='label'>Last run</span>
        <p>{new Date(meta.lastRun).toUTCString()}</p>
      </Row>
      <Row>
        <Col>
          <span className='label'>Successful runs</span>
          <p>{meta.successfulRuns}</p>
        </Col>
        <Col>
          <span className='label'>Failed runs</span>
          <p>{meta.failedRuns}</p>
        </Col>
        <Col>
          <span className='label'>Success rate</span>
          <p>{getSuccessRate()}</p>
        </Col>
      </Row>
    </>
  );
};

export default RunnerStatus;
