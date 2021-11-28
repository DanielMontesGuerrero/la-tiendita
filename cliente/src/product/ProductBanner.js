import React, {Component} from 'react';
import {Card, Container, Col, Row, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import StoreIcon from '../store/StoreIcon.js';
import {QuantityPicker} from 'react-qty-picker';

class ProductBanner extends Component {
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
      <Container>
        <Card>
          <Row className="align-items-center">
            <Col md={2}>
              <Card.Img src={this.props.image}/>
            </Col>
            <Col className="mx-3">
              <Card.Title>{this.getTitle()}</Card.Title>
              <Card.Text>{this.props.description}</Card.Text>
            </Col>
            <Col md={3} className="mb-2">
              {this.props.inCart ?
                <center>
                  <QuantityPicker smooth min={0}/>
                </center> :
                <Score score={this.props.score}/>
              }
            </Col>
          </Row>
          {this.props.inCart ? <div></div> :
          <Row className="mb-3">
            <Col md={2} className="mx-3">
              Disponible en:
            </Col>
            <Col className="px-3">
              <Stack gap={3} direction="horizontal" className="overflow-auto">
                {this.getStores()}
              </Stack>
            </Col>
          </Row>
          }
        </Card>
      </Container>
    );
  }
}

export default ProductBanner;
