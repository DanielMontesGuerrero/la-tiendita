import React, {Component} from 'react';
import {Form, Modal, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import UserProfile from '../common/UserProfile';
import config from '../common/config';
import axios from 'axios';

class RequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: UserProfile.getIdUser(),
      file: null,
    };
  }

  static get propTypes() {
    return {
      show: PropTypes.bool,
      onHide: PropTypes.func,
    };
  }

  handleOnFileChange(e) {
    const getFile = e.target.files[0];
    this.setState({
      file: getFile,
    });
  }

  enviarSolicitudVendor() {
    if (this.state.file===null) {
      alert('Favor de subir un archivo');
    } else {
      console.log(this.state.file);
      const formData = new FormData();
      formData.append('file', this.state.file);
      formData.append('id', this.state.id);
      const options = {
        url: `${config.host}/user/request/${UserProfile.getIdUser()}`,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      };
      axios(options).then((res) => {
        this.props.onHide;
        alert('Tu solicitud sera revisada en cuanto se tenga una' +
            ' respuesta lo sabras');
      });
    }
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
            <Form.Control type="file" onChange={(e)=>
              this.handleOnFileChange(e)} />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={this.props.onHide}>
            Cancelar
          </Button>
          <Button variant="primary"
            onClick={() => this.enviarSolicitudVendor()}>
            Enviar solicitud</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RequestForm;
