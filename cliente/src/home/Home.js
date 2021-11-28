import React from 'react';
import './Home.css';
import {Component} from 'react';
import NavigationBar from '../common/NavigationBar.js';
import {Container, Stack, Col, Row} from 'react-bootstrap';
import ProductCard from '../product/ProductCard.js';
import StoreCard from '../store/StoreCard.js';

class Home extends Component {
  componentDidMount() {
    this.productsContainer.addEventListener(
        'wheel',
        this.horizontalScrollEventHandler,
    );
    this.storesContainer.addEventListener(
        'wheel',
        this.horizontalScrollEventHandler,
    );
  }
  getProducts() {
    const data = require('../common/products.json');
    const products = data.products;
    return products.map((item, index) => {
      return (<ProductCard
        name={item.name}
        image={item.image}
        score={item.score}
        description={item.description}
        quantity={item.quantity}
        unity={item.unity}
        key={index}/>);
    });
  }

  getStores() {
    const data = require('../common/stores.json');
    const stores = data.stores;
    return stores.map((item, index) => {
      return (
        <StoreCard
          name={item.name}
          description={item.description}
          score={item.score}
          key={index}
        />
      );
    });
  }

  horizontalScrollEventHandler(event) {
    event.preventDefault();
    this.scrollBy({
      left: event.deltaY < 0 ? -30 : 30,
    });
  }

  render() {
    return (
      <div>
        <NavigationBar/>
        <Container className="my-4">
          <Row>
            <Col>
              <Stack
                gap={3}
                direction="horizontal"
                className="overflow-auto"
                ref={(elem) => this.productsContainer = elem}>
                {this.getProducts()}
              </Stack>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <Stack
                gap={3}
                direction="horizontal"
                className="overflow-auto"
                ref={(elem) => this.storesContainer = elem}>
                {this.getStores()}
              </Stack>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
