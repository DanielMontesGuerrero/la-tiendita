import React, {Component} from 'react';
import {Card, Col, Row, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import StoreIcon from '../store/StoreIcon.js';
import './ProductCard.css';
import config from '../common/config.js';
import axios from 'axios';

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
    };
  }

  componentDidMount() {
    const options = {
      url: `${config.host}/product/stores/${this.props.id_product}`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res);
      if (res.data.result) {
        this.setState({stores: res.data.response});
      }
    });
  }

  static get propTypes() {
    return {
      id_product: PropTypes.number,
      name: PropTypes.string,
      score: PropTypes.number,
      image: PropTypes.string,
      quantity: PropTypes.number,
      unity: PropTypes.string,
      description: PropTypes.string,
      inCart: PropTypes.bool,
    };
  }

  getTitle() {
    let title = this.props.name;
    if (this.props.quantity !== null) {
      title += ' | ' + this.props.quantity + ' ' + this.props.unity;
    }
    return title;
  }

  getStores() {
    // const data = require('../common/stores.json');
    const stores = this.state.stores;
    return stores.map((item, index) => {
      return (
        <StoreIcon
          name={item.name}
          image={item.image}
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

