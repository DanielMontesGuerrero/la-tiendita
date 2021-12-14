import React, {Component} from 'react';
import {Stack, Modal, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import './ProductCard.css';
import ScoreBanner from '../common/ScoreBanner.js';
import config from '../common/config.js';
import axios from 'axios';

class ProductInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scores: [],
    };
  }

  static get propTypes() {
    return {
      id_product: PropTypes.number,
      show: PropTypes.bool,
      onHide: PropTypes.func,
      name: PropTypes.string,
      score: PropTypes.number,
      description: PropTypes.string,
    };
  }

  componentDidMount() {
    const options = {
      url: `${config.host}/product/score/${this.props.id_product}`,
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
          <p>{this.props.description}</p>
          <p>Reseñas:</p>
          <Stack gap={2}>
            {this.renderScores()}
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProductInfo;
