import React, {Component} from 'react';
import {Form, Modal, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import config from '../common/config.js';
import axios from 'axios';

class InstitutionForm extends Component {
  constructor(props) {
    super(props);
    this.name = '';
    this.imageURL = '';
    this.imageFile = null;
  }

  static get propTypes() {
    return {
      show: PropTypes.bool,
      onHide: PropTypes.func,
    };
  }

  createInstitution() {
    if (this.name.length === 0) {
      return alert('Se necesita el nombre de la escuela');
    }
    const options = {
      url: `${config.host}/institution`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        name: this.name,
        image: this.imageURL,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        alert('Institución creada');
        this.uploadImage(res.data.response.insertId);
        this.props.onHide();
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
      url: `${config.host}/institution/image/${id}`,
      method: 'post',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data'},
    };
    axios(options).then((res) => {
      console.log(res.data);
    });
  }

  render() {
    return (
      <Modal
        {...this.props}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear Institución</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              placeholder="Nombre"
              onChange={(e) => this.name = e.target.value}
            />
          </Form.Group>
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
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={this.props.onHide}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => this.createInstitution()}
          >
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default InstitutionForm;
