import React, {Component} from 'react';
import {Stack, Container} from 'react-bootstrap';
import ProductBanner from './ProductBanner.js';
import NavigationBar from '../common/NavigationBar.js';

class ProductShop extends Component {
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
            </Stack>
          </div>
        </Container>
      </div>
    );
  }
}

export default ProductShop;

