import React, {Component} from 'react';
import {
  Row,
  Col,
  Form,
  Card,
  Stack,
  Button,
  Collapse,
  Badge} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Score from '../common/Score.js';
import UserProfile from '../common/UserProfile';
import config from '../common/config';
import axios from 'axios';

class StoreSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventoryOpen: false,
      deliveryOpen: false,
      paymentOpen: false,
      id_store: UserProfile.getIdStore(),
      name: '',
      id_user: UserProfile.getIdUser(),
      description: '',
      image: '',
      score: null,
    };
  }

  componentDidMount() {
    document.title = 'Mi Tienda';
    console.log('si toy aqui');
    if (UserProfile.getIdUser() === null) {
      window.location = '/';
    }
    const options = {
      url: `${config.host}/store/${UserProfile.getIdStore()}`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res.data.response);
      this.setState({name: res.data.response[0].name});
      this.setState({description: res.data.response[0].description});
      this.setState({image: res.data.response[0].image});
    });
  }

  actualizarStore() {
    console.log(this.state);
    const data = {
      name: this.state.name,
      description: this.state.description,
    };

    const options = {
      url: `${config.host}/store/${this.state.id_store}`,
      method: 'patch',
      params: {
        includeScore: true,
        onlyTop: true,
      },
      data: data,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      console.log(res);
      alert('Datos actualizados');
    });
  }

  render() {
    return (
      <div>
        <Card className="pt-3">
          <Row className="justify-content-center px-4">
            <Col md="auto">
              <Stack gap={2}>
                <Badge
                  bg="dark">
                  {this.state.name}
                </Badge>
                <center>
                  <FontAwesomeIcon icon="store" size="10x"/>
                </center>
                <Score score={this.state.score}/>
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
                      value={this.state.name}
                      onChange={(e) => this.setState({name: e.target.value})}
                      defaultValue="Tienda de fulano" />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="descripcion">
                  <Form.Label column sm="4">
                    Descripción
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      value={this.state.description}
                      onChange={
                        (e) => this.setState({description: e.target.value})
                      }
                      defaultValue="Bueno bonito y barato ;)" />
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
                      defaultValue={UserProfile.getIdInstitution()} />
                  </Col>
                </Form.Group>

              </Form>
            </Col>
          </Row>
          <Stack gap={2} className="col-md-5 mx-auto mb-3">
            <center>
              {/* eslint-disable-next-line max-len */}
              <Button onClick={() => this.actualizarStore()} variant="primary" type="button">
                Actualizar datos
              </Button>
            </center>
          </Stack>
          <Stack gap={2} className="col-md-5 mx-auto mb-3 mt-4">
            <Button
              variant="primary"
              aria-controls="inventoryCollapse"
              aria-expanded={this.state.inventoryOpen}
              onClick={() =>
                this.setState({inventoryOpen: !this.state.inventoryOpen})}
            >Inventario</Button>
            <Button
              variant="primary"
              aria-controls="deliveryCollapse"
              aria-expanded={this.state.deliveryOpen}
              onClick={() =>
                this.setState({deliveryOpen: !this.state.deliveryOpen})}
            >Métodos de entrega</Button>
            <Button
              variant="primary"
              aria-controls="paymentCollapse"
              aria-expanded={this.state.paymentOpen}
              onClick={() =>
                this.setState({paymentOpen: !this.state.paymentOpen})}
            >Métodos de pago</Button>
          </Stack>
          <Collapse in={this.state.inventoryOpen}>
            <div id="inventoryCollapse">
              <center>Aquí van las opciones para el
              manejar el inventario de la tienda</center>
            </div>
          </Collapse>
          <Collapse in={this.state.deliveryOpen}>
            <div id="deliveryCollapse">
              <center>Aquí van las opciones para el
              manejar los métodos de entrega de la tienda</center>
            </div>
          </Collapse>
          <Collapse in={this.state.paymentOpen}>
            <div id="paymentCollapse">
              <center>Aquí van las opciones para el
              manejar los métodos de pago de la tienda</center>
            </div>
          </Collapse>
        </Card>
      </div>
    );
  }
}

export default StoreSettings;


