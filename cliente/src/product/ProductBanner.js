import React, {Component} from 'react';
import {
  Card,
  Container,
  Col,
  Row,
  Stack,
  Button,
  FloatingLabel,
  Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import StoreIcon from '../store/StoreIcon.js';
import {QuantityPicker} from 'react-qty-picker';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ProductInfo from './ProductInfo.js';
import ScoreForm from '../common/ScoreForm.js';
import UserProfile from '../common/UserProfile.js';
import config from '../common/config.js';
import axios from 'axios';

class ProductBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      formShow: false,
      price: props.price,
      stock: props.numProducts,
    };
  }

  static get propTypes() {
    return {
      id_product: PropTypes.number,
      name: PropTypes.string,
      score: PropTypes.number,
      image: PropTypes.string,
      quantity: PropTypes.number,
      unity: PropTypes.string,
      description: PropTypes.string,
      inCart: PropTypes.bool,
      inInfo: PropTypes.bool,
      price: PropTypes.number,
      numProducts: PropTypes.number,
      onQtyPickerChange: PropTypes.func,
      id_store: PropTypes.number,
      storeName: PropTypes.string,
      storeImage: PropTypes.string,
      inInventory: PropTypes.bool,
    };
  }

  getTitle() {
    let title = this.props.name;
    if (this.props.quantity !== null) {
      title += ' | ' + this.props.quantity + ' ' + this.props.unity;
    }
    return title;
  }

  getStores() {
    const data = require('../common/stores.json');
    const stores = data.stores;
    return stores.map((item, index) => {
      return (
        <StoreIcon
          name={item.name}
          price={item.price}
          key={index}
        />
      );
    });
  }

  setModalShow(modalShow) {
    this.setState({modalShow: modalShow});
  }

  addToCart() {
    const options = {
      url: `${config.host}/cart/${UserProfile.getIdUser()}`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res);
      if (res.data.result) {
        const indexOfProductsMap = new Map();
        const products = res.data.response;
        products.forEach((item, index) => {
          indexOfProductsMap.set(`${item.id_product}.${item.id_store}`, index);
        });
        if (
          !indexOfProductsMap.has(
              `${this.props.id_product}.${this.props.id_store}`,
          )
        ) {
          products.push({
            id_product: this.props.id_product,
            id_store: this.props.id_store,
            numProducts: 1,
          });
        } else {
          const index = indexOfProductsMap.get(
              `${this.props.id_product}.${this.props.id_store}`,
          );
          products[index].numProducts++;
        }
        const optionsUpdate = {
          url: `${config.host}/cart/${UserProfile.getIdUser()}`,
          method: 'patch',
          data: products,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        };
        axios(optionsUpdate).then((resCart) => {
          console.log(resCart);
          alert('Añadido al carrito');
        });
      }
    });
  }

  updateProductInStore() {
    const options = {
      url: `${config.host}/store/productInStore/${this.props.id_store}`,
      method: 'patch',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        id_store: this.props.id_store,
        id_product: this.props.id_product,
        price: this.state.price,
        stock: this.state.stock,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data) {
        alert('Producto actualizado');
      }
    });
  }

  render() {
    return (
      <Container>
        <Card>
          <Row className="align-items-center">
            <Col md={2}>
              <Card.Img src={this.props.image}/>
            </Col>
            <Col className="mx-3">
              <Card.Title>{this.getTitle()}</Card.Title>
              <Card.Text>{this.props.description}</Card.Text>
            </Col>
            <Col md={4} className="mb-2">
              {this.props.inCart || this.props.inInventory ?
                <center>
                  <QuantityPicker
                    smooth
                    min={0}
                    value={this.props.numProducts}
                    onChange={(value) => {
                      if (this.props.inInventory) {
                        this.setState({stock: value});
                      } else {
                        this.props.onQtyPickerChange(value);
                      }
                    }}
                  />
                </center> :
                <Score score={this.props.score}/>
              }
            </Col>
          </Row>
          {this.props.inCart || this.props.inInfo ?
            <Row className="justify-content-md-center mb-2">
              <Col md="auto" className="fw-bold fs-5 text-center">
                {`Comprar en: ${this.props.storeName} a $${this.props.price}`}
              </Col>
            </Row> : (
              this.props.inInventory ?
                <></> :
                <Row className="mb-3">
                  <Col md={2} className="mx-3">
                    Disponible en:
                  </Col>
                  <Col className="px-3">
                    <Stack
                      gap={3}
                      direction="horizontal"
                      className="overflow-auto"
                    >
                      {this.getStores()}
                    </Stack>
                  </Col>
                </Row>
            )
          }
          <Row className="mb-3 justify-content-md-center">
            {this.props.inInfo ?
              <Col md="auto">
                <Button onClick={() => this.addToCart()}>
                  <FontAwesomeIcon icon="cart-plus"/>{' '}Añadir al carrito
                </Button>
              </Col>:
              <></>
            }
            { this.props.inInventory ?
              <Col md="auto">
                <Button
                  variant="outline-dark"
                  onClick={() => this.updateProductInStore()}
                >
                  Actualizar producto
                </Button>
              </Col> :
              <Col md="auto">
                <Button
                  variant="outline-warning"
                  onClick={() => this.setState({formShow: true})}
                >
                  <FontAwesomeIcon icon="star"/>{' '}Calificar
                </Button>
              </Col>
            }
            {
              this.props.inInventory ?
                <Col md="auto">
                  <FloatingLabel
                    controlId="score"
                    label="Precio"
                    className="mb-2"
                  >
                    <Form.Control
                      type="number"
                      value={this.state.price}
                      onChange={
                        (evt) => this.setState({price: evt.target.value})
                      }
                    />
                  </FloatingLabel>
                </Col>:
                <></>
            }
            {
              !this.props.inCart && !this.props.inInventory ?
                <Col md="auto">
                  <Button
                    variant="outline-dark"
                    onClick={() => this.setModalShow(true)}
                  >
                    Ver reseñas
                  </Button>
                </Col> :
                <></>
            }
          </Row>
        </Card>
        <ProductInfo
          show={this.state.modalShow}
          id_product={this.props.id_product}
          name={this.props.name}
          description={this.props.description}
          score={this.props.score}
          onHide={() => this.setModalShow(false)}
        />
        <ScoreForm
          scoreType="product"
          id_product={this.props.id_product}
          name={this.props.name}
          show={this.state.formShow}
          onHide={() => this.setState({formShow: false})}
        />
      </Container>
    );
  }
}

export default ProductBanner;
