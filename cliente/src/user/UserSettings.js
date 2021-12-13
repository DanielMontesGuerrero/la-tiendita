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
import config from "../common/config";
import axios from "axios";
import UserProfile from "../common/UserProfile";
import User from "./User";
import orders from "../common/orders.json";

const UserTypes = {
  user: 'user',
  vendor: 'vendor',
  admin: 'admin',
};

class UserSettings extends Component {
  state = {
    userType: UserTypes.user,
    modalShow: false,
    user: {
      email: UserProfile.getEmail(),
      id_school: UserProfile.getIdSchool(),
      id_user: UserProfile.getIdUser(),
      image: UserProfile.getImage(),
      name: UserProfile.getName(),
      userType: UserProfile.getUserType()
    },
    orders: null
  }

  componentDidMount() {
    if (!this.state.orders) {
      this.getOrders().then((data) => this.setState({orders:data}))
          .catch((err) => {console.log("s")});
    }
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
      console.log(res.data.response)
      orders = res.data.response;
      orders = orders.map((item, index) => {
        return (<Order
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
    return await orders;

  }

  actualizarUser = () => {
    if(      this.state.user.email=== UserProfile.getEmail()&&
        this.state.user.id_school=== UserProfile.getIdSchool()&&
        this.state.user.name=== UserProfile.getName()&&
        this.state.user.userType=== UserProfile.getUserType()){
      alert("No has cambiado nada")

    }else {
      const options = {
        url: `${config.host}/user/${UserProfile.getIdUser()}`,
        method: 'post',
        params: {
          includeScore: true,
          onlyTop: true,
        },
        data: this.state.user,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      };
      axios(options).then((res) => {
        console.log(res)
        localStorage.clear();
        UserProfile.setName(this.state.user.name)
        UserProfile.setEmail(this.state.user.email)
        UserProfile.setIdSchool(this.state.user.id_school)
        UserProfile.setIdUser(this.state.user.id_user)
        UserProfile.setImage(this.state.user.image)
        UserProfile.setUserType(this.state.user.userType)
        alert("Datos actualizados")
      });
    }
  }

  cerrarSesion(){
    localStorage.clear()
    window.location.href = "/";
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
                      defaultValue="No user name"
                      value={this.state.user.name}
                      onChange={(e) => this.setState({user: { name:e.target.value, email:this.state.user.email, id_school: this.state.user.id_school,
                          id_user: this.state.user.id_user,
                          image: this.state.user.image,
                          userType: this.state.user.userType}})}
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
                      onChange={(e) => this.setState({user: { email:e.target.value,
                          name:this.state.user.name, id_school: this.state.user.id_school,
                          id_user: this.state.user.id_user,
                          image: this.state.user.image,
                          userType: this.state.user.userType}})}
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
                      value={this.state.user.id_school}
                      onChange={(e) => this.setState({user: {id_school:e.target.value,
                          name:this.state.user.name, email: this.state.user.email,
                          id_user: this.state.user.id_user,
                          image: this.state.user.image,
                          userType: this.state.user.userType}})}
                      defaultValue="ESCOM" />
                  </Col>
                </Form.Group>

              </Form>
            </Col>
          </Row>
          <Stack gap={2} className="col-md-5 mx-auto mb-3">
            <center>
              {/* eslint-disable-next-line max-len */}
              <Button onClick={this.actualizarUser} variant="primary" type="button">
                Actualizar datos
              </Button>
            </center>
            <center>
              {/* eslint-disable-next-line max-len */}
              <Button onClick={this.cerrarSesion} variant="danger" type="button">
                Cerrar Sesión
              </Button>
            </center>
          </Stack>
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


