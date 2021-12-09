import React, {Component} from 'react';
import {
  Row,
  Col,
  Form,
  Card,
  Badge,
  Stack,
  Button,
  Accordion} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import RequestForm from './RequestForm.js';
import Order from './Order.js';

const UserTypes = {
  user: 'user',
  vendor: 'vendor',
  admin: 'admin',
};

class UserSettings extends Component {
  state = {
    userType: UserTypes.user,
    modalShow: false,
  }

  setModalShow(modalShow) {
    this.setState({modalShow: modalShow});
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

  getOrders() {
    const orders = require('../common/orders.json');
    return orders.map((item, index) => {
      return (<Order
        store={item.store}
        product={item.product}
        quantity={item.quantity}
        price={item.price}
        date={item.date}
        state={item.state}
        key={index}/>);
    });
  }

  render() {
    return (
      <div>
        <Card className="pt-3 mb-2">
          <Row className="justify-content-center px-4">
            <Col md="auto">
              <Stack>
                <center>
                  <FontAwesomeIcon icon="user" size="10x"/>
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
            <Button
              variant="primary"
              onClick={() => this.setModalShow(true)}
            >
              Solicitar cuenta de vendor
            </Button>
          </Stack>
          <Row className="justify-content-center mb-4">
            <Col md={5}>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Mis pedidos</Accordion.Header>
                  <Accordion.Body className="">
                    {this.getOrders()}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Card>
        <RequestForm
          show={this.state.modalShow}
          onHide={() => this.setModalShow(false)}
        />
      </div>
    );
  }
}

export default UserSettings;


