import React, {Component} from 'react';
import {Stack, Container} from 'react-bootstrap';
import ProductBanner from './ProductBanner.js';
import NavigationBar from '../common/NavigationBar.js';
import config from '../common/config.js';
import axios from 'axios';

class ProductShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    document.title = 'Productos';
    const options = {
      url: `${config.host}/product/all`,
      method: 'get',
      params: {
        includeScore: true,
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      this.setState({products: res.data.response});
    });
  }

  getProducts() {
    const products = this.state.products;
    return products.map((item, index) => {
      return (<ProductBanner
        id_product={item.id_product}
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


