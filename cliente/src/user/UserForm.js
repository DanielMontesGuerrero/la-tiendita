import React, {Component} from 'react';
import {
  Form,
  Modal,
  Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import config from '../common/config.js';
import axios from 'axios';
import validator from 'validator';
import UserProfile from '../common/UserProfile.js';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this. imageURL = '';
    this.imageFile = null;
  }

  static get propTypes() {
    return {
      show: PropTypes.bool,
      onHide: PropTypes.func,
    };
  }

  updateUser() {
    if (this.imageURL.length > 0 && !validator.isURL(this.imageURL)) {
      return alert('Url no válida');
    }
    const options = {
      url: `${config.host}/user/${UserProfile.getIdUser()}`,
      method: 'patch',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        imageURL: this.imageURL,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        alert('Imagen actualizada');
        this.uploadImage(UserProfile.getIdUser());
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
      url: `${config.host}/user/image/${id}`,
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
          <Modal.Title>Añadir foto de usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
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
            onClick={() => this.props.onHide()}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => this.updateUser()}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UserForm;
