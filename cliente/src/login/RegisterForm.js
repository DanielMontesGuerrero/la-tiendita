import {Component} from 'react';
import React from 'react';
import {Container, Row, Col, Card, Form, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './Login.css';

class RegisterForm extends Component {
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
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Nombre
                    </Form.Label>
                    <Col>
                      <Form.Control type="text"/>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Email
                    </Form.Label>
                    <Col>
                      <Form.Control type="email"/>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Escuela
                    </Form.Label>
                    <Col>
                      <Form.Control type="text"/>
                    </Col>
                  </Form.Group>

                  <center>
                    <Button variant="primary" type="submit">
                      Registrarse
                    </Button>
                    <Form.Text>¿Ya tienes cuenta?{' '}
                      <button className="button-link"
                        onClick={this.props.toggleAction}>Ingresar</button>
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

export default RegisterForm;


