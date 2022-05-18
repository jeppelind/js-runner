import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import './Header.scss';
import packageJSON from '../../../../package.json';

const Header = () => (
  <Navbar variant='dark' fixed='top'>
    <Container fluid>
      <Navbar.Brand>JSRunner</Navbar.Brand>
      <Navbar.Collapse>
        <Navbar.Text className='version-number'>{packageJSON.version}</Navbar.Text>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Header;
