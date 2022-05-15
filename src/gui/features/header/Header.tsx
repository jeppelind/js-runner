import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import './Header.scss';

const Header = () => (
  <Navbar variant='dark' fixed='top'>
    <Container fluid>
      <Navbar.Brand>JSRunner</Navbar.Brand>
    </Container>
  </Navbar>
);

export default Header;
