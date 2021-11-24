import {Component} from 'react';
import React from 'react';
import {Container, Card, Button, Row, Col, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './Login.css';

class LoginForm extends Component {
  static get propTypes() {
    return {
      toggleAction: PropTypes.func,
    };
  }
  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Card>
              <center className="textCenter mt-3">
                <FontAwesomeIcon icon="user" size="10x"/>
              </center>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="email"
                      placeholder="Nombre de usuario o email"/>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Contraseña" />
                  </Form.Group>
                  <center>
                    <Button variant="primary" type="submit">
                      Ingresar
                    </Button>
                    <Form.Text>¿No tienes cuenta?{' '}
                      <button className="button-link"
                        onClick={this.props.toggleAction}>Registrarse</button>
                    </Form.Text>
                  </center>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LoginForm;

