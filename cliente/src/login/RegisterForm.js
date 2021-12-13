import {Component} from 'react';
import React from 'react';
import {Container, Row, Col, Card, Form, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './Login.css';
import PropTypes from 'prop-types';
import UserProfile from "../common/UserProfile";
import config from "../common/config";
import axios from "axios";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      id_school: '',
      nombre: '',
    };
  }
  componentDidMount(){
    if(UserProfile.getName()!==null){
      window.location.href = "/";
      console.log(UserProfile.getName())
    }
  }
  static get propTypes() {
    return {
      toggleAction: PropTypes.func,
    };
  }

  registerUser = () => {
    if((this.state.name===undefined)||(this.state.email===undefined)||(this.state.password===undefined)||(this.state.id_school===undefined)||
        !(this.state.name.length>0)||!(this.state.email.length>0)||!(this.state.password.length>0)||!(this.state.id_school.length>0)){
      alert("Datos incompletos");
    }else {
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
        // eslint-disable-next-line no-invalid-this
        this.setState({user: res.data.response});
        if(res.data.result){
          window.location.href = "/login";
        }
      }).catch((error)=>{
        if( error.response ){
          alert(error.response.data.description)
        }else {
          console.log(error.response.data); // => the response payload
          alert("Hay un error favor de intentarlo mas tarde")
        }

      });
    }


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
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Nombre
                    </Form.Label>
                    <Col>
                      <Form.Control
                          value={this.state.name}
                          onChange={(e) => this.setState({name: e.target.value})}
                          type="text"/>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Email
                    </Form.Label>
                    <Col>
                      <Form.Control value={this.state.email}
                                    onChange={(e) => this.setState({email: e.target.value})}
                                    type="email"/>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Password
                    </Form.Label>
                    <Col>
                      <Form.Control
                          value={this.state.password}
                          onChange={(e) => this.setState({password: e.target.value})}
                          type="text"/>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Escuela
                    </Form.Label>
                    <Col>
                      <Form.Control
                          value={this.state.id_school}
                          onChange={(e) => this.setState({id_school: e.target.value})}
                          type="text"/>
                    </Col>
                  </Form.Group>

                  <center>
                    <Button onClick={this.registerUser} variant="primary" type="button">
                      Registrarse
                    </Button>
                    <Form.Text>¿Ya tienes cuenta?{' '}
                      <button className="button-link"
                        onClick={this.props.toggleAction}>Ingresar</button>
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

export default RegisterForm;


