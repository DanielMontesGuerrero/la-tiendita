import React, {Component} from 'react';
import {Stack, Modal, Button, Collapse} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import ProductBanner from '../product/ProductBanner.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './StoreCard.css';
import ScoreBanner from '../common/ScoreBanner.js';
import config from '../common/config.js';
import axios from 'axios';

class StoreInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoresOpen: false,
      scores: [],
    };
  }

  static get propTypes() {
    return {
      id_store: PropTypes.number,
      ownerName: PropTypes.string,
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

  getScores() {
    const options = {
      url: `${config.host}/store/score/${this.props.id_store}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      console.log(res);
      this.setState({scores: res.data.response});
    });
  }

  renderScores() {
    return this.state.scores.map((item, index) => {
      return (
        <ScoreBanner
          name={item.name}
          score={item.score}
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
          <p>Dueño de la tienda: {this.props.ownerName}</p>
          <p>{this.props.description}</p>
          <p>Productos disponibles: </p>
          <Stack gap={3} className="mb-3">
            {this.getProductInfo()}
          </Stack>
          <center className="mb-3">
            <Button
              variant="outline-dark"
              aria-controls="scoresCollapse"
              aria-expanded={this.state.scoresOpen}
              onClick={() => {
                this.setState({scoresOpen: !this.state.scoresOpen});
                this.getScores();
              }}
            >
              Ver reseñas
            </Button>
          </center>
          <Collapse in={this.state.scoresOpen}>
            <div id="scoresCollapse">
              <Stack gap={2}>
                {this.renderScores()}
              </Stack>
            </div>
          </Collapse>
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
