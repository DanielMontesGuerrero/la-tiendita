import React, {Component} from 'react';
import {
  Stack,
  Modal,
  Button,
  Collapse,
  ButtonGroup,
  ListGroup,
  Row,
  Col,
  ToggleButton} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import ProductBanner from '../product/ProductBanner.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './StoreCard.css';
import ScoreBanner from '../common/ScoreBanner.js';
import config from '../common/config.js';
import axios from 'axios';
import ScoreForm from '../common/ScoreForm.js';
import UserIcon from '../common/UserIcon.js';
import StoreIconBig from '../common/StoreIconBig.js';

class StoreInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      scoresOpen: false,
      scores: [],
      formShow: false,
      radioButtonGroup: '',
      paymentMethods: [],
      deliveryPoints: [],
    };
  }

  componentDidMount() {
    let options = {
      url: `${config.host}/product/all`,
      method: 'get',
      params: {
        includeScore: true,
        onStore: this.props.id_store,
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      this.setState({products: res.data.response});
    });
    options = {
      url: `${config.host}/store/payment/${this.props.id_store}`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res.data);
      this.setState({paymentMethods: res.data.response});
    });
    options.url = `${config.host}/store/delivery/${this.props.id_store}`;
    axios(options).then((res) => {
      console.log(res.data);
      this.setState({deliveryPoints: res.data.response});
    });
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
      image: PropTypes.string,
      userType: PropTypes.string,
      ownerImage: PropTypes.string,
    };
  }

  getProductInfo() {
    // const data = require('../common/products.json');
    // const products = data.products;
    return this.state.products.map((item, index) => {
      return (
        <ProductBanner
          id_product={item.id_product}
          id_store={this.props.id_store}
          name={item.name}
          image={item.image}
          inInfo={true}
          score={item.score}
          quantity={item.quantity}
          unity={item.unity}
          price={item.price}
          storeName={this.props.name}
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

  renderPaymentMethods() {
    const list = this.state.paymentMethods.map((item, index) => {
      return (
        <ListGroup.Item key={index} as="li">{item.description}</ListGroup.Item>
      );
    });
    return (
      <ListGroup variant="flush" as="ol" className="mb-3" numbered>
        {list}
      </ListGroup>
    );
  }

  renderDeliveryPoints() {
    const list = this.state.deliveryPoints.map((item, index) => {
      return (
        <ListGroup.Item key={index} as="li">
          <b>{item.name}: </b>
          {item.description}
        </ListGroup.Item>
      );
    });
    return (
      <ListGroup variant="flush" as="ol" className="mb-3" numbered>
        {list}
      </ListGroup>
    );
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
          <Row className="justify-content-center px-4 mb-3">
            <Col md="auto">
              <UserIcon
                name={this.props.ownerName}
                userType={this.props.userType}
                image={this.props.ownerImage}
              />
            </Col>
            <Col md="auto">
              <StoreIconBig
                image={this.props.image}
                name={this.props.name}
                score={this.props.score}
              />
            </Col>
          </Row>
          <p>Dueño de la tienda: {this.props.ownerName}</p>
          <p>{this.props.description}</p>
          <p>Productos disponibles: </p>
          <center>
            <ButtonGroup>
              <ToggleButton
                type="radio"
                id="delivery"
                variant="outline-dark"
                value="delivery"
                checked={this.state.radioButtonGroup === 'delivery'}
                onChange={
                  (e) => this.setState({
                    radioButtonGroup: e.currentTarget.value,
                  })
                }
              >
                Puntos de entrega
              </ToggleButton>
              <ToggleButton
                type="radio"
                id="payment"
                variant="outline-dark"
                value="payment"
                checked={this.state.radioButtonGroup === 'payment'}
                onChange={
                  (e) => this.setState({
                    radioButtonGroup: e.currentTarget.value,
                  })
                }
              >
                Métodos de pago
              </ToggleButton>
            </ButtonGroup>
          </center>
          {
            this.state.radioButtonGroup === 'payment' ?
              this.renderPaymentMethods() :
              (
                this.state.radioButtonGroup === 'delivery' ?
                this.renderDeliveryPoints() :
                <></>
              )
          }
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
          <Button
            variant="outline-warning"
            onClick={() => this.setState({formShow: true})}
          >
            <FontAwesomeIcon icon="star"/>{' '}Calificar tiendita
          </Button>
          <Button onClick={this.props.onHide}>Cerrar</Button>
        </Modal.Footer>
        <ScoreForm
          scoreType="store"
          id_store={this.props.id_store}
          name={this.props.name}
          show={this.state.formShow}
          onHide={() => this.setState({formShow: false})}
        />
      </Modal>
    );
  }
}

export default StoreInfo;
