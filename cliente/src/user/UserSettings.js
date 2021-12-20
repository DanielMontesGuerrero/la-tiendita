import React, {Component} from 'react';
import {
  Row,
  Col,
  Form,
  Card,
  Stack,
  Button,
  Accordion} from 'react-bootstrap';
import RequestForm from './RequestForm.js';
import Order from './Order.js';
import config from '../common/config';
import axios from 'axios';
import UserProfile from '../common/UserProfile';
import UserIcon from '../common/UserIcon.js';

class UserSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      showStoreForm: false,
      user: {
        email: UserProfile.getEmail(),
        institutionName: UserProfile.getInstitutionName(),
        id_user: UserProfile.getIdUser(),
        image: UserProfile.getImage(),
        name: UserProfile.getName(),
        userType: UserProfile.getUserType(),
        id_institution: UserProfile.getIdInstitution(),
      },
      institutions: [],
      orders: null,
    };
  }

  componentDidMount() {
    document.title = 'Mi perfil';
    if (!this.state.orders) {
      this.getOrders().then((data) => this.setState({orders: data}))
          .catch((err) => console.log('s'));
      this.getInstititions();
    }
  }

  setModalShow(modalShow) {
    this.setState({modalShow: modalShow});
  }

  getInstititions() {
    const options = {
      url: `${config.host}/institution/get/all`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        this.setState({institutions: res.data.response});
        if (res.data.response.length > 0) {
          this.setState({id_institution: res.data.response[0].id_institution});
        }
      }
    });
  }

  renderInstitutions() {
    return this.state.institutions.map((item, index) => {
      return (
        <option value={item.id_institution} key={index}>{item.name}</option>
      );
    });
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
    if (this.state.user.email === UserProfile.getEmail() &&
        this.state.user.id_institution === UserProfile.getIdInstitution() &&
        this.state.user.institutionName === UserProfile.getInstitutionName() &&
        this.state.user.name === UserProfile.getName() &&
        this.state.user.userType === UserProfile.getUserType()) {
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
        UserProfile.setName(this.state.user.name);
        UserProfile.setEmail(this.state.user.email);
        const newInstitutoName = this.state.institutions.filter(
            (element, index)=>{
              return element.id_institution==this.state.user.id_institution;
            });
        UserProfile.setIdInstitution(this.state.user.id_institution);
        UserProfile.setInstitutionName(newInstitutoName[0].name);
        UserProfile.setImage(this.state.user.image);
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
              <UserIcon
                inSettings={true}
                userType={this.state.user.userType}
                image={this.state.user.image}
                name={this.state.user.name}
              />
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
                      readOnly
                      plaintext
                      defaultValue="No user name"
                      value={this.state.user.name}
                      onChange={
                        (e) => this.setState({
                          user: {
                            name: e.target.value,
                            email: this.state.user.email,
                            institutionName: this.state.user.institutionName,
                            id_institution: this.state.user.id_institution,
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
                      readOnly
                      plaintext
                      value={this.state.user.email}
                      onChange={
                        (e) => this.setState({
                          user: {
                            email: e.target.value,
                            name: this.state.user.name,
                            institutionName: this.state.user.institutionName,
                            id_institution: this.state.user.id_institution,
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
                    <Form.Select
                      value={this.state.user.id_institution}
                      onChange={
                        (e) => this.setState({user: {
                          institutionName: this.state.user.institutionName,
                          id_institution: e.target.value,
                          name: this.state.user.name,
                          email: this.state.user.email,
                          id_user: this.state.user.id_user,
                          image: this.state.user.image,
                          userType: this.state.user.userType,
                        }})
                      }
                    >
                      {this.renderInstitutions()}
                    </Form.Select>
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
            {
              UserProfile.getUserType() === 'usuario' ?
                <Button
                  variant="primary"
                  onClick={() => this.setModalShow(true)}
                >
                  Solicitar cuenta de vendor
                </Button> :
                  <></>
            }
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


