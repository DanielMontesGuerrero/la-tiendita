import React, {Component} from 'react';
import {Stack, Card, Container, Col, Row, Button, Image} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';
import ProductIcon from '../product/ProductIcon.js';
import StoreInfo from './StoreInfo';
import config from '../common/config';
import axios from 'axios';

class ProductBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      products: [],
    };
  }

  setModalShow(modalShow) {
    this.setState({modalShow: modalShow});
  }

  static get propTypes() {
    return {
      id_store: PropTypes.number,
      ownerName: PropTypes.string,
      name: PropTypes.string,
      score: PropTypes.number,
      description: PropTypes.string,
      image: PropTypes.string,
      ownerImage: PropTypes.string,
      userType: PropTypes.userType,
    };
  }
  async componentDidMount() {
    const options = {
      url: `${config.host}/store/productInStore/${this.props.id_store}`,
      method: 'get',
    };
    axios(options).then(async (res) => {
      const productos = res.data.response;
      let len = productos.length;
      if (len > 3) {
        len = 3;
      }
      const topProductos = [];
      for (let i = 0; i < len; i++) {
        options.url = `${config.host}/product/${productos[i].id_product}`;
        await axios(options).then((resP) => {
          topProductos.push(resP.data.response[0]);
        });
      }
      this.setState({products: topProductos});
      console.log(this.state.products);
    });
  }

  getProductIcons() {
    // const data = require('../common/products.json');
    // const products = data.products;
    const products = this.state.products;
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
                {
                  this.props.image !== null && this.props.image !== undefined ?
                    <Image src={this.props.image} style={{maxWidth: 100}}
                      rounded
                    /> :
                    <FontAwesomeIcon icon="store" size="5x"/>
                }
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
            <Col>
              <Stack gap={3} direction="horizontal" className="overflow-auto">
                {this.getProductIcons()}
              </Stack>
            </Col>
            <Col md={3}>
              <center>
                <Button
                  variant="outline-dark"
                  onClick={() => this.setModalShow(true)}>
                  Ver mas...
                </Button>
              </center>
            </Col>
          </Row>
        </Card>
        <StoreInfo
          show={this.state.modalShow}
          id_store={this.props.id_store}
          ownerName={this.props.ownerName}
          name={this.props.name}
          description={this.props.description}
          score={this.props.score}
          ownerImage={this.props.ownerImage}
          userType={this.props.userType}
          image={this.props.image}
          onHide={() => this.setModalShow(false)}
        />
      </Container>
    );
  }
}

export default ProductBanner;

