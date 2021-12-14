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
import config from '../common/config';
import axios from 'axios';
import UserProfile from '../common/UserProfile';

const UserTypes = {
  user: 'usuario',
  vendor: 'vendedor',
  admin: 'admin',
};

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      user: {
        email: UserProfile.getEmail(),
        institutionName: UserProfile.getInstitutionName(),
        id_user: UserProfile.getIdUser(),
        image: UserProfile.getImage(),
        name: UserProfile.getName(),
        userType: UserProfile.getUserType(),
      },
      orders: null,
    };
  }

  componentDidMount() {
    if (!this.state.orders) {
      this.getOrders().then((data) => this.setState({orders: data}))
          .catch((err) => console.log('s'));
    }
  }

  setModalShow(modalShow) {
    this.setState({modalShow: modalShow});
  }

  getBadge() {
    let color = 'secondary';
    if (this.state.user.userType === UserTypes.vendor) {
      color = 'success';
    } else if (this.state.user.userType === UserTypes.admin) {
      color = 'danger';
    }
    return (
      <Badge bg={color} className="mt-3">{this.state.user.userType}</Badge>
    );
  }

  async getOrders() {
    let orders = [];

    const options = {
      url: `${config.host}/purchase?id_user=${UserProfile.getIdUser()}`,
      method: 'get',
      params: {
        includeScore: true,
        onlyTop: true,
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    await axios(options).then((res) => {
      console.log(res.data.response);
      orders = res.data.response;
      orders = orders.map((item, index) => {
        return (<Order
          id_purchase={item.id_purchase}
          id_store={item.id_store}
          id_user={item.id_user}
          store={item.storeName}
          product={item.productName}
          quantity={item.quantity}
          price={item.unitary_price}
          date={item.date}
          state={item.state}
          key={index}/>);
      });
    });
    console.log(orders);
    return orders;
  }

  actualizarUser() {
    if (this.state.user.email=== UserProfile.getEmail() &&
        this.state.user.institutionName=== UserProfile.getInstitutionName()&&
        this.state.user.name=== UserProfile.getName()&&
        this.state.user.userType=== UserProfile.getUserType()) {
      alert('No has cambiado nada');
    } else {
      const options = {
        url: `${config.host}/user/${UserProfile.getIdUser()}`,
        method: 'patch',
        data: this.state.user,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      };
      axios(options).then((res) => {
        console.log(res);
        localStorage.clear();
        UserProfile.setName(this.state.user.name);
        UserProfile.setEmail(this.state.user.email);
        UserProfile.setInstitutionName(this.state.user.institutionName);
        UserProfile.setIdUser(this.state.user.id_user);
        UserProfile.setImage(this.state.user.image);
        UserProfile.setUserType(this.state.user.userType);
        alert('Datos actualizados');
      });
    }
  }

  cerrarSesion() {
    localStorage.clear();
    window.location.href = '/';
  }

  render() {
    return (
      <div>
        <Card className="pt-3 mb-2">
          <Row className="justify-content-center px-4 mb-3">
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
                      defaultValue="No user name"
                      value={this.state.user.name}
                      onChange={
                        (e) => this.setState({
                          user: {
                            name: e.target.value,
                            email: this.state.user.email,
                            institutionName: this.state.user.institutionName,
                            id_user: this.state.user.id_user,
                            image: this.state.user.image,
                            userType: this.state.user.userType,
                          },
                        })
                      }
                    />
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
                      value={this.state.user.email}
                      onChange={
                        (e) => this.setState({
                          user: {
                            email: e.target.value,
                            name: this.state.user.name,
                            institutionName: this.state.user.institutionName,
                            id_user: this.state.user.id_user,
                            image: this.state.user.image,
                            userType: this.state.user.userType,
                          },
                        })
                      }
                    />
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
                      value={this.state.user.institutionName}
                      onChange={
                        (e) => this.setState({
                          user: {
                            institutionName: e.target.value,
                            name: this.state.user.name,
                            email: this.state.user.email,
                            id_user: this.state.user.id_user,
                            image: this.state.user.image,
                            userType: this.state.user.userType,
                          },
                        })
                      }
                    />
                  </Col>
                </Form.Group>

              </Form>
            </Col>
          </Row>
          <Stack gap={2} className="col-md-5 mx-auto mb-3">
            <Button
              onClick={() => this.actualizarUser()}
              variant="primary"
              type="button"
            >
              Actualizar datos
            </Button>
            <Button
              variant="primary"
              onClick={() => this.setModalShow(true)}
            >
              Solicitar cuenta de vendor
            </Button>
            <Button
              onClick={() => this.cerrarSesion()}
              variant="danger"
              type="button"
            >
              Cerrar Sesión
            </Button>
          </Stack>
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Mis pedidos</Accordion.Header>
                  <Accordion.Body>
                    {this.state.orders}
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


