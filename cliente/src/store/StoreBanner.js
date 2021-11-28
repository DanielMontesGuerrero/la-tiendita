import React, {Component} from 'react';
import {Stack, Card, Container, Col, Row} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import ProductIcon from '../product/ProductIcon.js';

class ProductBanner extends Component {
  static get propTypes() {
    return {
      name: PropTypes.text,
      score: PropTypes.number,
      description: PropTypes.text,
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
      <Container>
        <Card>
          <Row className="align-items-center pt-2">
            <Col md={2}>
              <center>
                <FontAwesomeIcon icon="store" size="5x"/>
              </center>
            </Col>
            <Col className="mx-3 mt-2">
              <Card.Title>{this.props.name}</Card.Title>
              <Card.Text>{this.props.description}</Card.Text>
            </Col>
            <Col md={3}>
              <Score score={this.props.score}/>
            </Col>
          </Row>
          <Row className="px-3 my-2">
            <Stack gap={3} direction="horizontal" className="overflow-auto">
              {this.getProductIcons()}
            </Stack>
          </Row>
        </Card>
      </Container>
    );
  }
}

export default ProductBanner;

