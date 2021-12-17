import React, {Component} from 'react';
import {Card, Col, Row, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import ProductIcon from '../product/ProductIcon.js';
import './StoreCard.css';
import config from '../common/config';
import axios from 'axios';

class StoreCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
  static get propTypes() {
    return {
      id_store: PropTypes.number,
      name: PropTypes.string,
      score: PropTypes.number,
      description: PropTypes.string,
    };
  }
  async componentDidMount() {
    const options = {
      url: `${config.host}/store/productInStore/${this.props.id_store}`,
      method: 'get',
    };
    axios(options).then(async (res) => {
      const productos = res.data.response;
      let len = productos.length;
      if (len > 3) {
        len = 3;
      }
      const topProductos = [];
      for (let i = 0; i < len; i++) {
        options.url = `${config.host}/product/${productos[i].id_product}`;
        await axios(options).then((resP) => {
          topProductos.push(resP.data.response[0]);
          console.log(resP.data.response[0]);
        });
      }
      this.setState({products: topProductos});
      console.log(this.state.products);
    });
  }

  getProductIcons() {
    // const data = require('../common/products.json');
    // const products = data.products;
    const products = this.state.products;
    return products.map((item, index) => {
      return (
        <ProductIcon
          name={item.name}
          image={item.image}
          key={index}
        />
      );
    });
  }

  render() {
    return (
      <div className="fixed-card-store">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <Card.Title>{this.props.name}</Card.Title>
            </Col>
            <Col className="mb-2">
              <Score score={this.props.score}/>
            </Col>
          </Row>
        </Card.Body>
        <Card.Body>
          <Card.Text>{this.props.description}</Card.Text>
        </Card.Body>
        <Card.Body className="info-continer-store">
          <Card.Text>
            Productos disponibles:
          </Card.Text>
          <Stack gap={2} direction="horizontal" className="overflow-auto">
            {this.getProductIcons()}
          </Stack>
        </Card.Body>
      </div>
    );
  }
}

export default StoreCard;


