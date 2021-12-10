import React, {Component} from 'react';
import {Form, Modal, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';

class RequestForm extends Component {
  static get propTypes() {
    return {
      show: PropTypes.bool,
      onHide: PropTypes.func,
    };
  }

  render() {
    return (
      <Modal
        {...this.props}
      >
        <Modal.Header closeButton>
          <Modal.Title>Solicitar cuenta de vendedor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Hola, gracias por tu interés en ser vendedor.
            Para obtener tu cuenta de vendedor necesitamos
            comprobar que eres un estudiante inscrito en
            alguna institución académica</p>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>
              Ingresa tu comprobante.
              Archivos pdf, jpeg, jpg y png son aceptados
            </Form.Label>
            <Form.Control type="file" />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={this.props.onHide}>
            Cancelar
          </Button>
          <Button variant="primary">Enviar solicitud</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RequestForm;
