import React, {Component} from 'react';
import {Form, Modal, Button, FloatingLabel, Row, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import config from '../common/config.js';
import axios from 'axios';
import validator from 'validator';

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.description = '';
    this.name = '';
    this.quantity = '';
    this. imageURL = '';
    this.unities = [
      'l',
      'ml',
      'g',
      'mg',
      'pza',
    ];
    this.imageFile = null;
  }

  static get propTypes() {
    return {
      show: PropTypes.bool,
      onHide: PropTypes.func,
      id_store: PropTypes.number,
    };
  }

  createPaymentMethod() {
    if (this.name.length === 0) {
      return alert('Se necesita un nombre');
    }
    if (this.description.length === 0) {
      return alert('Se necesita una descripción');
    }
    if (this.imageURL.length > 0 && !validator.isURL(this.imageURL)) {
      return alert('Url no válida');
    }
    const options = {
      url: `${config.host}/product`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        description: this.description,
        name: this.name,
        imageURL: this.imageURL,
        quantity: this.quantity,
        unity: this.unity,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        alert('Producto creado');
        this.addProductToStore(res.data.response.insertId);
        this.uploadImage(res.data.response.insertId);
      } else {
        alert(res.data.description);
      }
    });
  }

  uploadImage(id) {
    if (this.imageFile === null) {
      return;
    }
    const formData = new FormData();
    formData.append('image', this.imageFile);
    const options = {
      url: `${config.host}/product/image/${id}`,
      method: 'post',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'},
    };
    axios(options).then((res) => {
      console.log(res.data);
    });
  }

  addProductToStore(id) {
    const options = {
      url: `${config.host}/store/productInStore/${this.props.id_store}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        id_store: this.props.id_store,
        id_product: id,
        stock: 0,
        price: 0,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        alert('Producto insertado en tienda');
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
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                placeholder="Nombre"
                onChange={(e) => this.name = e.target.value}
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="1"
                  onChange={(e) => this.quantity = e.target.value}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Unidad</Form.Label>
                <Form.Select
                  defaultValue="Elegir..."
                  onChange={(e) => this.unity = e.target.value}
                >
                  <option value="">Elegir...</option>
                  {this.unities.map((item, index) => {
                    return (
                      <option key={index} value={item}>{item}</option>
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
            <Form.Group className="mb-3">
              <Form.Label>Imagen (link)</Form.Label>
              <Form.Control
                placeholder="link de la imagen"
                onChange={(e) => this.imageURL = e.target.value}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                Imagen (archivo)
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => this.imageFile = e.target.files[0]}
              />
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
