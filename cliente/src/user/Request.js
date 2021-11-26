import React, {Component} from 'react';
import {Card, Button, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';

class Request extends Component {
  static get propTypes() {
    return {
      user: PropTypes.text,
      downloadLink: PropTypes.text,
    };
  }

  render() {
    return (
      <Card>
        <Card.Header as="h5">Petición de: {this.props.user}</Card.Header>
        <Card.Body>
          <Card.Text>
            Descarga el comprobante de Fulano{' '}
            <a href={this.props.downloadLink}>aquí.
            </a>
          </Card.Text>
          <Stack gap={2} direction="horizontal">
            <Button variant="success">Aceptar</Button>
            <Button variant="danger">Rechazar</Button>
          </Stack>
        </Card.Body>
      </Card>
    );
  }
}

export default Request;


