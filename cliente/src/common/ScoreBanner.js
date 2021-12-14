import React, {Component} from 'react';
import {Card, Container, Col, Row} from 'react-bootstrap';
import PropTypes from 'prop-types';
import Score from '../common/Score.js';

class ScoreBanner extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string,
      score: PropTypes.number,
      description: PropTypes.string,
    };
  }

  render() {
    return (
      <Container>
        <Card>
          <Row className="align-items-center pt-2">
            <Col className="mx-3 mt-2">
              <Card.Title>{this.props.name}</Card.Title>
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

export default ScoreBanner;
