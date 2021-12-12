import {Component} from 'react';
import React from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import UserProfile from "./UserProfile";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
    };
  }
  render() {
    let buttonHtml=<Nav.Link href="/profile">
      <FontAwesomeIcon icon="user" size="lg"/>{' '}Perfil
    </Nav.Link>;
    if(UserProfile.getName()===null){
      buttonHtml = <Nav.Link href="/login">
        <FontAwesomeIcon icon="user" size="lg"/>{' '}Ingresar
      </Nav.Link>
    }
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">La Tiendita</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/products">Productos</Nav.Link>
              <Nav.Link href="/stores">Tienditas</Nav.Link>
            </Nav>
            <Nav>
              {buttonHtml}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavigationBar;
