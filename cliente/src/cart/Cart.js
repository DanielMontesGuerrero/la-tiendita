import React, {Component} from 'react';
import {Stack, Container, Button} from 'react-bootstrap';
import ProductBanner from '../product/ProductBanner.js';
import NavigationBar from '../common/NavigationBar.js';

class Cart extends Component {
  getProducts() {
    const data = require('../common/products.json');
    const products = data.products;
    return products.map((item, index) => {
      return (<ProductBanner
        name={item.name}
        image={item.image}
        score={item.score}
        description={item.description}
        quantity={item.quantity}
        unity={item.unity}
        price={item.price}
        inCart={true}
        key={index}/>);
    });
  }

  render() {
    return (
      <div>
        <NavigationBar/>
        <Container className="mt-4">
          <div className="p-5">
            <Stack gap={3}>
              {this.getProducts()}
              <Container>
                <Button variant="primary">Confirmar pedido</Button>
              </Container>
            </Stack>
          </div>
        </Container>
      </div>
    );
  }
}

export default Cart;
