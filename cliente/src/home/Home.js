import React from 'react';
import './Home.css';
import {Component} from 'react';
import NavigationBar from '../common/NavigationBar.js';
import {Container, Col, Row, Button} from 'react-bootstrap';
import ProductCard from '../product/ProductCard.js';
import StoreCard from '../store/StoreCard.js';
import {ScrollMenu, VisibilityContext} from 'react-horizontal-scrolling-menu';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import config from '../common/config.js';
import axios from 'axios';

function LeftArrow() {
  const {isFirstItemVisible, scrollPrev} =
    React.useContext(VisibilityContext);

  return (
    <Button
      variant="light"
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}>
      <FontAwesomeIcon
        icon="chevron-left"
        size="3x"/>
    </Button>
  );
}

function RightArrow() {
  const {isLastItemVisible, scrollNext} = React.useContext(VisibilityContext);

  return (
    <Button
      variant="light"
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}>
      <FontAwesomeIcon
        icon="chevron-right"
        size="3x"/>
    </Button>
  );
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      stores: [],
    };
  }

  componentDidMount() {
    const options = {
      url: `${config.host}/product/all`,
      method: 'get',
      params: {
        includeScore: true,
        onlyTop: true,
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      this.setState({products: res.data.response});
    });
    options.url = `${config.host}/store/all`;
    axios(options).then((res) => {
      this.setState({stores: res.data.response});
    });
  }

  getProducts() {
    // const data = require('../common/products.json');
    // const products = data.products;
    const products = this.state.products;
    return products.map((item, index) => {
      return (<ProductCard
        itemId={index}
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
    // const data = require('../common/stores.json');
    // const stores = data.stores;
    const stores = this.state.stores;
    return stores.map((item, index) => {
      return (
        <StoreCard
          itemId={index}
          name={item.name}
          description={item.description}
          score={item.score}
          key={index}
        />
      );
    });
  }

  onWheel(apiObj, ev) {
    const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
    ev.preventDefault();
    if (isThouchpad) {
      ev.stopPropagation();
      return;
    }

    if (ev.deltaY < 0) {
      apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
      apiObj.scrollPrev();
    }
    return false;
  }

  render() {
    return (
      <div>
        <NavigationBar/>
        <Container className="my-4">
          <Row className="mt-5">
            <Col>
              <ScrollMenu
                LeftArrow={LeftArrow}
                RightArrow={RightArrow}>
                {this.getProducts()}
              </ScrollMenu>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <ScrollMenu
                LeftArrow={LeftArrow}
                RightArrow={RightArrow}>
                {this.getStores()}
              </ScrollMenu>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
