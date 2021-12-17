import {Component} from 'react';
import React from 'react';
import {Container, Row, Col, Card, Form, Button, Alert} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './Login.css';
import PropTypes from 'prop-types';
import UserProfile from '../common/UserProfile';
import config from '../common/config';
import axios from 'axios';
import InstitutionForm from '../common/InstitutionForm.js';

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: '',
      email: '',
      password: '',
      id_institution: null,
      name: '',
      institutions: [],
      institutionModalShow: false,
    };
  }

  componentDidMount() {
    document.title = 'Registrarse';
    if (UserProfile.getName()!==null) {
      window.location.href = '/';
      console.log(UserProfile.getName());
    }
    this.getInstititions();
  }

  static get propTypes() {
    return {
      toggleAction: PropTypes.func,
    };
  }

  registerUser() {
    if (
      (this.state.name===undefined) ||
      (this.state.email===undefined) ||
      (this.state.password===undefined) ||
      (this.state.id_institution===undefined) ||
      !(this.state.name.length>0) ||
      !(this.state.email.length>0) ||
      !(this.state.password.length>0)) {
      // alert('Datos incompletos');
      this.setState({formError: 'Hay datos incompletos'});
    } else {
      const options = {
        url: `${config.host}/user`,
        method: 'post',
        params: {
          includeScore: true,
          onlyTop: true,
        },
        data: this.state,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      };
      axios(options).then((res) => {
        this.setState({user: res.data.response});
        if (res.data.result) {
          window.location.href = '/login';
        }
      }).catch((error)=>{
        // alert(error.response.data.description);
        this.setState({formError: error.response.data.description});
      });
    }
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
          this.setState({id_institution: res.data.response[0].id_institution});
        }
      }
    }).catch((err) => {
      console.log(err);
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
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Card>
              <center className="textCenter mt-3">
                <FontAwesomeIcon icon="user" size="10x"/>
              </center>
              <Card.Body>
                {
                  this.state.formError !== '' ?
                    <Alert variant="danger">{this.state.formError}</Alert> :
                    <></>
                }
                <Form onSubmit={(e) => e.preventDefault()}>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">
                      Nombre
                    </Form.Label>
                    <Col>
                      <Form.Control
                        value={this.state.name}
                        onChange={
                          (e) => this.setState({name: e.target.value})
                        }
                        type="text"/>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">
                      Email
                    </Form.Label>
                    <Col>
                      <Form.Control value={this.state.email}
                        onChange={(e) => this.setState({email: e.target.value})}
                        type="email"/>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">
                      Contraseña
                    </Form.Label>
                    <Col>
                      <Form.Control
                        value={this.state.password}
                        onChange={
                          (e) => this.setState({password: e.target.value})
                        }
                        type="password"/>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="4">Institución</Form.Label>
                    <Col>
                      <Form.Select
                        onChange={
                          (e) => this.setState({id_institution: e.target.value})
                        }
                      >
                        {this.renderInstitutions()}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                  <center>
                    <Button
                      onClick={() => this.registerUser()}
                      variant="primary"
                      type="submit">
                      Registrarse
                    </Button>
                  </center>
                </Form>

                <center className="mt-1">
                  <Form.Text>¿Ya tienes cuenta?{' '}
                    <button type="button" className="button-link"
                      onClick={this.props.toggleAction}>Ingresar</button>
                  </Form.Text>
                  <Form.Text>¿No encuentras tu Institución?{' '}
                    <button className="button-link"
                      onClick={
                        () => this.setState({institutionModalShow: true})
                      }>
                      Registrar Institución</button>
                  </Form.Text>
                </center>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <InstitutionForm
          show={this.state.institutionModalShow}
          onHide={() => this.setState({institutionModalShow: false})}
        />
      </Container>
    );
  }
}

export default RegisterForm;


