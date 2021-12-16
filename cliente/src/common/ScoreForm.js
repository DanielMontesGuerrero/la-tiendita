import React, {Component} from 'react';
import {Form, Modal, Button, FloatingLabel, Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';
import UserProfile from '../common/UserProfile.js';
import config from '../common/config.js';
import axios from 'axios';

class ScoreForm extends Component {
  constructor(props) {
    super(props);
    this.score = 5;
    this.description = '';
    this.state = {
      formError: '',
    };
  }

  static get propTypes() {
    return {
      scoreType: PropTypes.string,
      id_store: PropTypes.number,
      id_product: PropTypes.number,
      show: PropTypes.bool,
      onHide: PropTypes.func,
      name: PropTypes.string,
    };
  }

  sendScore() {
    const isValidScore = (score) => {
      if (!/\d+/.test(score)) {
        return false;
      }
      score = parseFloat(score);
      if (score < 0 || score > 5) {
        return false;
      }
      return true;
    };
    if (!isValidScore(this.score) ||
      !(this.props.scoreType === 'product' ||
        this.props.scoreType === 'store')) {
      this.setState({
        formError: 'La calificación debe estar en el rango [0,5]'},
      );
    } else if (UserProfile.getIdUser() === null) {
      this.setState({
        formError: 'Necesitas iniciar sesión'},
      );
    } else {
      const id = this.props.scoreType === 'store' ?
        this.props.id_store : this.props.id_product;
      const options = {
        url: `${config.host}/${this.props.scoreType}/score/${id}`,
        method: 'post',
        data: {
          id_user: UserProfile.getIdUser(),
          score: parseFloat(this.score),
          description: this.description,
        },
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      };
      axios(options).then((res) => {
        console.log(res);
        if (res.data.response) {
          alert('Calificación enviada');
          window.location.href = `/${this.props.scoreType}s`;
        }
      });
    }
  }

  render() {
    return (
      <Modal
        {...this.props}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enviar nueva reseña</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Hola, tus comentarios ayudan a la comunidad a recibir
            un servicio de calidad
          </p>
          <p>Ingresa tu reseña de: <b>{this.props.name}</b></p>
          {
            this.state.formError !== '' ?
              <Alert variant="danger">{this.state.formError}</Alert> :
              <></>
          }
          <FloatingLabel
            controlId="score"
            label="Calificación"
            className="mb-2"
          >
            <Form.Control
              type="number"
              defaultValue="5"
              onChange={(evt) => this.score = evt.target.value}
            />
          </FloatingLabel>
          <FloatingLabel controlId="comments" label="Reseña">
            <Form.Control
              as="textarea"
              placeholder="Ingresa tus comenta aquí"
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
          <Button variant="primary" onClick={() => this.sendScore()}>
            Enviar reseña
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ScoreForm;
