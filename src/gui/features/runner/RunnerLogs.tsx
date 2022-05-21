import React from 'react';
import { Row, Stack } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { logByIdSelector, logsSelector } from '../../app/store';

const LogItem = ({ id }: { id: string }) => {
  const log = useRecoilValue(logByIdSelector(id));
  const timestamp = new Date(log.time).toLocaleString();

  return (
    <Row className={`log log-${log.level}`}>
      <Stack direction='horizontal'>
        <div className='label'>{log.meta.script}</div>
        <small className='timestamp ms-auto'>{timestamp}</small>
      </Stack>
      <p className='log-message'>{log.msg}</p>
    </Row>
  );
};

const RunnerLogs = () => {
  const { logIds } = useRecoilValue(logsSelector);

  return (
    <>
      <h6 className='dash-heading'>LIVE LOG</h6>
      {
        logIds.map((logId) => <LogItem key={logId} id={logId} />)
      }
    </>
  );
};

export default RunnerLogs;
