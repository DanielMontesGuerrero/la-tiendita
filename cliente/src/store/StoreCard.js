import React, {Component} from 'react';
import {Card, Col, Row, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import ProductIcon from '../product/ProductIcon.js';
import './StoreCard.css';

class StoreCard extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string,
      score: PropTypes.number,
      description: PropTypes.string,
    };
  }

  getProductIcons() {
    const data = require('../common/products.json');
    const products = data.products;
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


