import React, {Component} from 'react';
import {Form, Modal, Button, FloatingLabel, Row, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import config from '../common/config.js';
import axios from 'axios';

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.description = '';
    this.unities = [
      'l',
      'ml',
      'g',
      'mg',
      'pza',
    ];
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
          <Modal.Title>Crear nuevo producto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Ingresa los datos del producto</p>
          <Form>
            <Form.Group className="mb-3" key={index}>
              <Form.Label>Nombre</Form.Label>
              <Form.Control placeholder="Nombre"/>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control type="number"/>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Unidad</Form.Label>
                <Form.Select defaultValue="Choose...">
                  <option>Elegir...</option>
                  {this.unities.map((item, index) => {
                    return (
                      <option key={index}>{item}</option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Row>
            <FloatingLabel label="Descripción">
              <Form.Control
                as="textarea"
                placeholder="Ingresa una descripción detallada"
                style={{height: '100px'}}
                onChange={(evt) => this.description = evt.target.value}
              />
            </FloatingLabel>
            <Form.Group className="mb-3" key={index}>
              <Form.Label>Imagen (link)</Form.Label>
              <Form.Control placeholder="Nombre"/>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                Imagen (archivo)
              </Form.Label>
              <Form.Control type="file" />
            </Form.Group>
          </Form>
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

export default ProductForm;
