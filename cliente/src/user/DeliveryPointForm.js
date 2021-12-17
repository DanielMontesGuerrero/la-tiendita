import React, {Component} from 'react';
import {Form, Modal, Button, FloatingLabel} from 'react-bootstrap';
import PropTypes from 'prop-types';
import InstitutionForm from '../common/InstitutionForm.js';
import config from '../common/config.js';
import axios from 'axios';

class DeliveryPointForm extends Component {
  constructor(props) {
    super(props);
    this.id_institution = null;
    this.description = '';
    this.state = {
      institutionModalShow: false,
      institutions: [],
    };
  }

  componentDidMount() {
    this.getInstititions();
  }

  static get propTypes() {
    return {
      show: PropTypes.bool,
      onHide: PropTypes.func,
      id_store: PropTypes.number,
    };
  }

  createDeliveryPoint() {
    if (this.description.length === 0) {
      return alert('Se necesita una descripción');
    }
    console.log(this.description, this.id_institution);
    const options = {
      url: `${config.host}/store/delivery/${this.props.id_store}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      data: {
        id_institution: this.id_institution,
        description: this.description,
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        alert('Punto de entrega creado');
        this.props.onHide();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  getInstititions() {
    const options = {
      url: `${config.host}/institution/get/all`,
      method: 'get',
    };
    axios(options).then((res) => {
      console.log(res.data);
      if (res.data.result) {
        this.setState({institutions: res.data.response});
        if (res.data.response.length > 0) {
          this.id_institution = res.data.response[0].id_institution;
        }
      }
    });
  }

  renderInstitutions() {
    return this.state.institutions.map((item, index) => {
      return (
        <option value={item.id_institution} key={index}>{item.name}</option>
      );
    });
  }

  render() {
    return (
      <Modal
        {...this.props}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear Punto de entrega</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Describe a tus clientes como pueden recibir sus productos</p>
          <FloatingLabel label="Descripción">
            <Form.Control
              as="textarea"
              placeholder="Ingresa una descripción detallada"
              style={{height: '100px'}}
              onChange={(evt) => this.description = evt.target.value}
            />
          </FloatingLabel>
          <Form.Group>
            <Form.Label>Institución</Form.Label>
            <Form.Select
              onChange={(e) => this.id_institution = e.target.value}
            >
              {this.renderInstitutions()}
            </Form.Select>
          </Form.Group>
          <Button
            variant="link"
            onClick={() => this.setState({institutionModalShow: true})}
          >Agregar institución</Button>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => this.props.onHide()}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => this.createDeliveryPoint()}
          >
            Crear
          </Button>
        </Modal.Footer>

        <InstitutionForm
          show={this.state.institutionModalShow}
          onHide={() => this.setState({institutionModalShow: false})}
        />
      </Modal>
    );
  }
}

export default DeliveryPointForm;
