import React, {Component} from 'react';
import {Card, Container, Col, Row} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';

class ProductBanner extends Component {
  static get propTypes() {
    return {
      name: PropTypes.text,
      score: PropTypes.number,
      image: PropTypes.text,
      quantity: PropTypes.number,
      unity: PropTypes.text,
      description: PropTypes.text,
    };
  }

  getTitle() {
    let title = this.props.name;
    if (this.props.quantity !== undefined) {
      title += ' | ' + this.props.quantity + ' ' + this.props.unity;
    }
    return title;
  }

  render() {
    return (
      <Container>
        <Card>
          <Row className="align-items-center">
            <Col md={2}>
              <Card.Img src={this.props.image}/>
            </Col>
            <Col>
              <Card.Title>{this.getTitle()}</Card.Title>
              <Card.Text>{this.props.description}</Card.Text>
            </Col>
            <Col md={3}>
              <Score score={this.props.score}/>
            </Col>
          </Row>
        </Card>
      </Container>
    );
  }
}

export default ProductBanner;
