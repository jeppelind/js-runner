import React from 'react';
import { Nav, Stack } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { IoWarning, IoAlertCircle } from 'react-icons/io5';
import { runnersSelector } from '../../app/store';
import './RunnerMenu.scss';

type RunnerMenuProps = {
  onSelectItem?: (id: string) => void,
}

type MenuItemProps = {
  label: string,
}

const MenuItem = ({ label }: MenuItemProps) => {
  const statusIcon = (status: string) => {
    if (status === 'error') {
      return <div className='ms-auto'><IoAlertCircle className='icon-error' /></div>;
    }
    if (status === 'warning') {
      return <div className='ms-auto'><IoWarning className='icon-warn' /></div>;
    }
    return null;
  };

  return (
    <Nav.Item key={label}>
      <Nav.Link eventKey={label}>
        <Stack className='menu-item-container' direction='horizontal'>
          <div className='menu-item-label'>{label}</div>{statusIcon(label)}
        </Stack>
      </Nav.Link>
    </Nav.Item>
  );
};

const RunnerMenu = ({ onSelectItem }: RunnerMenuProps) => {
  const { activeRunners, inactiveRunners } = useRecoilValue(runnersSelector);

  return (
    <div className='runner-menu'>
      <Nav className='flex-column' variant='pills' onSelect={onSelectItem}>
        <span className='menu-label'>Active</span>
        {
          activeRunners.map((runner) => (
            <MenuItem label={runner.id} />
          ))
        }
        <br />
        <span className='menu-label'>Inactive</span>
        {
          inactiveRunners.map((runner) => (
            <MenuItem label={runner.id} />
          ))
        }
      </Nav>
    </div>
  );
};

export default RunnerMenu;
