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
import ProductBanner from '../product/ProductBanner.js';
import PaymentMethodForm from './PaymentMethodForm.js';
import ProductForm from './ProductForm.js';

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
      showPaymentMethodsModal: false,
      showProductsModal: false,
      description: '',
      store: {},
      products: [],
      paymentMethods: [],
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
      params: {
        includeScore: true,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        this.setState({
          store: res.data.response[0],
          description: res.data.response[0].description},
        );
      }
    });
    this.getProductsInStore();
    this.getPaymentMethods();
  }

  updateStore() {
    const data = {
      description: this.state.description,
    };

    const options = {
      url: `${config.host}/store/${UserProfile.getIdStore()}`,
      method: 'patch',
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

  getProductsInStore() {
    const options = {
      url: `${config.host}/store/productInStore/${UserProfile.getIdStore()}`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        this.setState({products: res.data.response});
      }
    });
  }

  getPaymentMethods() {
    const options = {
      url: `${config.host}/store/payment/${UserProfile.getIdStore()}`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        this.setState({paymentMethods: res.data.response});
      }
    });
  }

  renderProducts() {
    return this.state.products.map((item, index) => {
      return (
        <ProductBanner
          id_product={item.id_product}
          id_store={item.id_store}
          name={item.name}
          image={item.image}
          score={item.score}
          description={item.description}
          quantity={item.quantity}
          unity={item.unity}
          price={item.price}
          storeName={item.storeName}
          storeImage={item.storeImage}
          numProducts={item.stock}
          inInventory={true}
          key={index}
        />
      );
    });
  }

  changePaymentDesciption(index, description) {
    this.setState((prevState) => {
      const methods = JSON.parse(JSON.stringify(prevState.paymentMethods));
      methods[index].description = description;
      return {paymentMethods: methods};
    });
  }

  updatePaymentMethod(index) {
    const item = this.state.paymentMethods[index];
    const options = {
      url: `${config.host}/store/payment/${item.id_method}`,
      method: 'patch',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        description: item.description,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        alert('Método de pago actualizado');
      }
    }).catch((err) => {
      console.log('Error:', err);
    });
  }

  renderPaymentMethods() {
    return this.state.paymentMethods.map((item, index) => {
      return (
        <Form.Group className="mb-3" key={index}>
          <Form.Label>Método de pago #{index + 1}</Form.Label>
          <Form.Control
            placeholder="Descripción"
            defaultValue={this.state.paymentMethods[index].description}
            onChange={
              (e) => this.changePaymentDesciption(index, e.target.value)
            }
          />
          <Button
            className="mt-1"
            variant="outline-dark"
            onClick={() => this.updatePaymentMethod(index)}
          >Actualizar método</Button>
        </Form.Group>
      );
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
                  {this.state.store.name}
                </Badge>
                <center>
                  <FontAwesomeIcon icon="store" size="10x"/>
                </center>
                <Score score={this.state.store.score}/>
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
                      value={this.state.store.name}
                      onChange={(e) => this.setState({name: e.target.value})}
                      defaultValue="Tienda de fulano" />
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
                      defaultValue={UserProfile.getInstitutionName()} />
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
                    />
                  </Col>
                </Form.Group>

              </Form>
            </Col>
          </Row>
          <Stack gap={2} className="col-md-5 mx-auto mb-3">
            <center>
              <Button
                onClick={() => this.updateStore()}
                variant="primary"
                type="button"
              >
                Actualizar descripción
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
            <div id="inventoryCollapse" className="mb-5">
              <center>
                <Stack gap={2}>
                  {this.renderProducts()}
                </Stack>
                <Button
                  variant="link"
                  onClick={() => this.setState({showProductsModal: true})}
                >Agregar nuevo producto</Button>
              </center>
            </div>
          </Collapse>
          <Collapse in={this.state.deliveryOpen}>
            <div id="deliveryCollapse" className="mb-5">
              <center>
                Aquí van las opciones para el
                manejar los métodos de entrega de la tienda
              </center>
            </div>
          </Collapse>
          <Collapse in={this.state.paymentOpen}>
            <div id="paymentCollapse">
              <center>
                <Stack gap={2} className="col-md-10">
                  {this.renderPaymentMethods()}
                </Stack>
                <Button
                  variant="link"
                  onClick={() => this.setState({showPaymentMethodsModal: true})}
                >Agregar nuevo método de pago</Button>
              </center>
            </div>
          </Collapse>
        </Card>
        <PaymentMethodForm
          id_store={UserProfile.getIdStore()}
          show={this.state.showPaymentMethodsModal}
          onHide={() => this.setState({showPaymentMethodsModal: false})}
        />
        <ProductForm
          id_store={UserProfile.getIdStore()}
          show={this.state.showProductsModal}
          onHide={() => this.setState({showProductsModal: false})}
        />
      </div>
    );
  }
}

export default StoreSettings;


