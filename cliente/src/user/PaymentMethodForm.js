import React, {Component} from 'react';
import {Form, Modal, Button, FloatingLabel} from 'react-bootstrap';
import PropTypes from 'prop-types';
import config from '../common/config.js';
import axios from 'axios';

class PaymentMethodForm extends Component {
  constructor(props) {
    super(props);
    this.description = '';
  }

  static get propTypes() {
    return {
      show: PropTypes.bool,
      onHide: PropTypes.func,
      id_store: PropTypes.number,
    };
  }

  createPaymentMethod() {
    const options = {
      url: `${config.host}/store/payment/${this.props.id_store}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        description: this.description,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        alert('Método de pago creado');
        this.props.onHide();
      }
    });
  }

  render() {
    return (
      <Modal
        {...this.props}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear Método de pago</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Describe a tus clientes como pueden pagar en tu tienda</p>
          <FloatingLabel label="Descripción">
            <Form.Control
              as="textarea"
              placeholder="Ingresa una descripción detallada"
              style={{height: '100px'}}
              onChange={(evt) => this.description = evt.target.value}
            />
          </FloatingLabel>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={this.props.onHide}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => this.createPaymentMethod()}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default PaymentMethodForm;
