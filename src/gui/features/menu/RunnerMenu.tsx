import React from 'react';
import { Badge, Nav } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { runnersSelector } from '../../app/store';
import './RunnerMenu.scss';

type RunnerMenuProps = {
  selectMenuItem?: (id: string) => void,
}

const RunnerMenu = ({ selectMenuItem }: RunnerMenuProps) => {
  const { activeRunners, inactiveRunners } = useRecoilValue(runnersSelector);

  return (
    <div className='runner-menu'>
      <Nav className='flex-column' variant='pills' onSelect={selectMenuItem}>
        <span className='menu-label'>Active</span>
        {
          activeRunners.map((runner) => (
            <Nav.Item key={runner.id}>
              <Nav.Link eventKey={runner.id}>{runner.id} <Badge pill bg="danger">9</Badge></Nav.Link>
            </Nav.Item>
          ))
        }
        <br />
        <span className='menu-label'>Inactive</span>
        {
          inactiveRunners.map((runner) => (
            <Nav.Item key={runner.id}>
              <Nav.Link eventKey={runner.id}>{runner.id}</Nav.Link>
            </Nav.Item>
          ))
        }
      </Nav>
    </div>
  );
};

export default RunnerMenu;
