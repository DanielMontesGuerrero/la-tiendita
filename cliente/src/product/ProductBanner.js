import React, {Component} from 'react';
import {Card, Container, Col, Row, Stack, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import StoreIcon from '../store/StoreIcon.js';
import {QuantityPicker} from 'react-qty-picker';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ProductInfo from './ProductInfo.js';
import ScoreForm from '../common/ScoreForm.js';

class ProductBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      formShow: false,
    };
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
      inInfo: PropTypes.bool,
      price: PropTypes.number,
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
    const data = require('../common/stores.json');
    const stores = data.stores;
    return stores.map((item, index) => {
      return (
        <StoreIcon
          name={item.name}
          price={item.price}
          key={index}
        />
      );
    });
  }

  setModalShow(modalShow) {
    this.setState({modalShow: modalShow});
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
            <Col md={4} className="mb-2">
              {this.props.inCart ?
                <center>
                  <QuantityPicker smooth min={0}/>
                </center> :
                <Score score={this.props.score}/>
              }
            </Col>
          </Row>
          {this.props.inCart || this.props.inInfo ?
            <Row className="justify-content-md-center mb-2">
              <Col md="auto" className="fw-bold fs-5 text-center">
                {'$ '}{this.props.price}
              </Col>
            </Row> :
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
          <Row className="mb-3 justify-content-md-center">
            {this.props.inInfo ?
              <Col md="auto">
                <Button>
                  <FontAwesomeIcon icon="cart-plus"/>{' '}Añadir al carrito
                </Button>
              </Col>:
              <></>
            }
            <Col md="auto">
              <Button
                variant="outline-warning"
                onClick={() => this.setState({formShow: true})}
              >
                <FontAwesomeIcon icon="star"/>{' '}Calificar
              </Button>
            </Col>
            <Col md="auto">
              <Button
                variant="outline-dark"
                onClick={() => this.setModalShow(true)}
              >
                Ver reseñas
              </Button>
            </Col>
          </Row>
        </Card>
        <ProductInfo
          show={this.state.modalShow}
          id_product={this.props.id_product}
          name={this.props.name}
          description={this.props.description}
          score={this.props.score}
          onHide={() => this.setModalShow(false)}
        />
        <ScoreForm
          scoreType="product"
          id_product={this.props.id_product}
          name={this.props.name}
          show={this.state.formShow}
          onHide={() => this.setState({formShow: false})}
        />
      </Container>
    );
  }
}

export default ProductBanner;
