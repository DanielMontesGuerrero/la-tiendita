import React, {Component} from 'react';
import {Card, Button, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';
import config from '../common/config';
import axios from 'axios';

class Request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
    };
  }
  static get propTypes() {
    return {
      status: PropTypes.string,
      id: PropTypes.number,
      id_user: PropTypes.number,
      voucher: PropTypes.text,
      user: PropTypes.text,
      downloadLink: PropTypes.text,
    };
  }

  aceptarSolicitud() {
    const options = {
      url: `${config.host}/user/request/${this.props.id}`,
      method: 'patch',
      data: {
        state: 'aceptado'},
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };

    axios(options).then((res) => {
      options.url = `${config.host}/user/${this.props.id}`;
      options.data = {
        userType: 'vendendor',
      };
      console.log(res);
      axios(options).then((resU) => {
        console.log(resU);
        options.url = `${config.host}/store`;
        options.data = {
          name: `Tienda de ${this.props.user}`,
          description: 'Modifica tu descripcion',
          id_user: this.props.id_user,
        };
        options.method = 'post';
        axios(options).then((resT) => {
          this.setState({status: true});
          alert('Se ha aceptado la apeticion y se a creado una tienda');
        });
      });
    });
  }

  rechazarSolicitud() {
    const options = {
      url: `${config.host}/user/request/${this.props.id}`,
      method: 'patch',
      data: {
        state: 'rechazado'},
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      this.setState({status: true});
      alert('La informacion ha sido actualizada');
    });
  }

  render() {
    return (
      <Card>
        <Card.Header as="h5">
          Petición de: {
            this.props.user +
              (this.props.status !== 'pendiente' ?
                ' Estado: ' + this.props.status :
                ''
              )
          }
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Descarga el comprobante de {this.props.user + ' '}
            <a href={this.props.downloadLink}>aquí.
            </a>
          </Card.Text>
          <Stack gap={2} direction="horizontal">
            <Button
              disabled={this.state.status || this.props.status !== 'pendiente'}
              variant="success"
              onClick={()=>this.aceptarSolicitud()}
            >Aceptar</Button>
            <Button
              disabled={this.state.status || this.props.status !== 'pendiente'}
              variant="danger"
              onClick={()=>this.rechazarSolicitud()}
            >Rechazar</Button>
          </Stack>
        </Card.Body>
      </Card>
    );
  }
}

export default Request;


