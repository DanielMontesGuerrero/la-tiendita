import React, {Component} from 'react';
import {Stack, Container, Button, Row, Col, Image} from 'react-bootstrap';
import ProductBanner from '../product/ProductBanner.js';
import NavigationBar from '../common/NavigationBar.js';
import config from '../common/config.js';
import UserProfile from '../common/UserProfile.js';
import axios from 'axios';

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    if (UserProfile.getIdUser() === null) {
      window.location = '/';
    }
    const options = {
      url: `${config.host}/cart/${UserProfile.getIdUser()}`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res.data);
      this.setState({products: res.data.response});
    });
  }

  getProducts() {
    // const data = require('../common/products.json');
    // const products = data.products;
    return this.state.products.map((item, index) => {
      return (<ProductBanner
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
        numProducts={item.numProducts}
        inCart={true}
        onQtyPickerChange={(num) => this.updateNumProducts(index, num)}
        key={index}/>);
    });
  }

  updateNumProducts(index, num) {
    this.setState((prevState) => {
      const products = JSON.parse(JSON.stringify(prevState.products));
      products[index].numProducts = num;
      // products = products.filter((item) => {
      //   return item.numProducts > 0;
      // });
      return {products: products};
    });
  }

  getTotalPrice() {
    let total = 0;
    this.state.products.forEach((item) => {
      total += item.price * item.numProducts;
    });
    return Math.round(total * 100) / 100;
  }

  sendPurchase() {
    const products = this.state.products.filter((item) => {
      return item.numProducts > 0;
    });
    const purchases = products.map((item) => {
      return {
        id_user: UserProfile.getIdUser(),
        id_store: item.id_store,
        id_product: item.id_product,
        quantity: item.numProducts,
        unitary_price: item.price,
      };
    });
    const options = {
      url: `${config.host}/purchase`,
      method: 'post',
      data: {
        purchases: purchases,
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      if (res.data.result) {
        alert('Compra confirmada');
        const optionsUpdateCart = {
          url: `${config.host}/cart/${UserProfile.getIdUser()}`,
          method: 'patch',
          data: [],
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
        };
        axios(optionsUpdateCart).then((res) => {
          console.log('Carrito actualizado');
          window.location.href = '/cart';
        });
      } else {
        alert('No se pudo confirmar la compra');
      }
    }).catch((err) => {
      alert('No se pudo confirmar la compra');
    });
  }

  render() {
    return (
      <div>
        <NavigationBar/>
        <Container className="mt-4">
          <div className="p-5">
            {
              this.state.products.length === 0 ?
                <Image src="https://i.ibb.co/MsgNsxT/empty.jpg" className="mb-3" width="100%"/> :
                <></>
            }
            <Stack gap={3}>
              {this.getProducts()}
              <Container>
                <Row>
                  <Col>
                    <Button
                      variant="primary"
                      onClick={() => this.sendPurchase()}
                    >Confirmar pedido</Button>
                  </Col>
                  <Col>
                    <h5>Total: ${this.getTotalPrice()}</h5>
                  </Col>
                </Row>
              </Container>
            </Stack>
          </div>
        </Container>
      </div>
    );
  }
}

export default Cart;
