import {Component} from 'react';
import React from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class NavigationBar extends Component {
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">La Tiendita</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/productos">Productos</Nav.Link>
              <Nav.Link href="/tienditas">Tienditas</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="/login">
                <FontAwesomeIcon icon="user" size="lg"/>{' '}Ingresar
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavigationBar;
