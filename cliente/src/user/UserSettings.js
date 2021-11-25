import React, {Component} from 'react';
import {Row, Col, Form, Card, Badge, Stack, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const UserTypes = {
  user: 'user',
  vendor: 'vendor',
  admin: 'admin',
};

class UserSettings extends Component {
  state = {
    userType: UserTypes.user,
  }

  getBadge() {
    let color = 'secondary';
    if (this.state.userType === UserTypes.vendor) {
      color = 'success';
    } else if (this.state.userType === UserTypes.admin) {
      color = 'danger';
    }
    return (<Badge bg={color} className="mt-3">{this.state.userType}</Badge>);
  }

  render() {
    return (
      <div>
        <Card className="pt-3">
          <Row className="justify-content-center px-4">
            <Col md="auto">
              <Stack>
                <center>
                  <FontAwesomeIcon icon="user" size="6x"/>
                </center>
                {this.getBadge()}
              </Stack>
            </Col>
            <Col md="auto">
              <Form>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="nombre">
                  <Form.Label column sm="4">
                    Nombre
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="Daniel" />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="email">
                  <Form.Label column sm="4">
                    Email
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="email@example.com" />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="boleta">
                  <Form.Label column sm="4">
                    Boleta
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="" />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="institucion">
                  <Form.Label column sm="4">
                    Institución
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="ESCOM" />
                  </Col>
                </Form.Group>

              </Form>
            </Col>
          </Row>
          <Stack gap={2} className="col-md-5 mx-auto mb-3">
            <Button variant="primary">Mis Pedidos</Button>
            <Button variant="primary">Solicitar cuenta de vendor</Button>
          </Stack>
        </Card>
      </div>
    );
  }
}

export default UserSettings;


