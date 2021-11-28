import React, {Component} from 'react';
import {Card, Col, Row, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import StoreIcon from '../store/StoreIcon.js';
import './ProductCard.css';

class ProductCard extends Component {
  static get propTypes() {
    return {
      name: PropTypes.text,
      score: PropTypes.number,
      image: PropTypes.text,
      quantity: PropTypes.number,
      unity: PropTypes.text,
      description: PropTypes.text,
      inCart: PropTypes.bool,
    };
  }

  getTitle() {
    let title = this.props.name;
    if (this.props.quantity !== undefined) {
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
          key={index}
        />
      );
    });
  }

  render() {
    return (
      <div className="fixed-card-product">
        <div className="img-container-product">
          <Card.Img src={this.props.image} className="img-product"/>
        </div>
        <div className="info-container-product">
          <Card.Body>
            <Row className="align-items-center">
              <Col>
                <Card.Title>{this.getTitle()}</Card.Title>
              </Col>
              <Col className="mb-2">
                <Score score={this.props.score}/>
              </Col>
            </Row>
          </Card.Body>
          <Card.Body>
            <Card.Text>{this.props.description}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Card.Text>
              Disponible en:
            </Card.Text>
            <Stack gap={2} direction="horizontal" className="overflow-auto">
              {this.getStores()}
            </Stack>
          </Card.Body>
        </div>
      </div>
    );
  }
}

export default ProductCard;

