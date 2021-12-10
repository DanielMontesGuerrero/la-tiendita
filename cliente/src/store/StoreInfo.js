import React, {Component} from 'react';
import {Stack, Modal, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import ProductBanner from '../product/ProductBanner.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './StoreCard.css';

class StoreInfo extends Component {
  static get propTypes() {
    return {
      show: PropTypes.bool,
      onHide: PropTypes.func,
      name: PropTypes.string,
      score: PropTypes.number,
      description: PropTypes.string,
    };
  }

  getProductInfo() {
    const data = require('../common/products.json');
    const products = data.products;
    return products.map((item, index) => {
      return (
        <ProductBanner
          name={item.name}
          image={item.image}
          inInfo={true}
          score={item.score}
          quantity={item.quantity}
          unity={item.unity}
          price={item.price}
          description={item.description}
          key={index}
        />
      );
    });
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.props.name}
          </Modal.Title>
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <Score score={this.props.score}/>
        </Modal.Header>
        <Modal.Body>
          <p>{this.props.description}</p>
          <p>Productos disponibles: </p>
          <Stack gap={3}>
            {this.getProductInfo()}
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-warning">
            <FontAwesomeIcon icon="star"/>{' '}Calificar tiendita
          </Button>
          <Button onClick={this.props.onHide}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default StoreInfo;
