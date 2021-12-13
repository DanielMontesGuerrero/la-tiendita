import {Component} from 'react';
import React from 'react';
import {Container, Card, Button, Row, Col, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './Login.css';
import PropTypes from 'prop-types';
import config from '../common/config';
import axios from 'axios';
import UserProfile from '../common/UserProfile';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      user: {
        email: '',
        id_school: null,
        id_user: null,
        image: null,
        name: '',
        userType: '',
      },
    };
  }

  componentDidMount() {
    if (UserProfile.getName()!==null) {
      window.location.href = '/';
      console.log('is'+UserProfile.getEmail());
      console.log('is'+UserProfile.getIdUser());
      console.log('is'+UserProfile.setUserType());
      console.log('is'+UserProfile.getIdSchool());
      console.log('is'+UserProfile.getImage());
    }
  }

  static get propTypes() {
    return {
      toggleAction: PropTypes.func,
    };
  }

  loginSession() {
    const options = {
      url: `${config.host}/user/login`,
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
      if (this.state.user.id_user!==undefined) {
        window.name = 'John';
        UserProfile.someProp = 'i am about to get cold';
        UserProfile.setName(this.state.user.name);
        UserProfile.setEmail(this.state.user.email);
        UserProfile.setIdSchool(this.state.user.id_school);
        UserProfile.setIdUser(this.state.user.id_user);
        UserProfile.setImage(this.state.user.image);
        UserProfile.setUserType(this.state.user.userType);
        Object.freeze(UserProfile);
        window.location.href = '/';
      } else {
        alert('El usuario o contraseña son erroneos');
      }
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
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="email"
                      value={this.state.email}
                      onChange={(e) => this.setState({email: e.target.value})}
                      placeholder="Nombre de usuario o email"/>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                      value={this.state.password}
                      onChange={
                        (e) => this.setState({password: e.target.value})
                      }
                      type="password"
                      placeholder="Contraseña"
                    />
                  </Form.Group>
                  <center>
                    <Button
                      onClick={() => this.loginSession()}
                      variant="primary"
                      type="button"
                    >
                      Ingresar
                    </Button>
                    <Form.Text>¿No tienes cuenta?{' '}
                      <button className="button-link"
                        onClick={this.props.toggleAction}
                      >Registrarse</button>
                    </Form.Text>
                  </center>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LoginForm;

