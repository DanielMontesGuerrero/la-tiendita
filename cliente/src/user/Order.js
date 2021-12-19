import React, {Component} from 'react';
import {Card, Badge, ButtonGroup, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import config from '../common/config.js';
import axios from 'axios';
import UserProfile from '../common/UserProfile.js';

class Order extends Component {
  static get propTypes() {
    return {
      id_purchase: PropTypes.number,
      id_store: PropTypes.number,
      id_user: PropTypes.number,
      product: PropTypes.string,
      store: PropTypes.string,
      quantity: PropTypes.number,
      price: PropTypes.number,
      date: PropTypes.number,
      state: PropTypes.string,
    };
  }

  formatDate(timestamp) {
    return moment.unix(timestamp).format('DD-MM-YYYY HH:mm:ss');
  }

  changeState(state) {
    const options = {
      url: `${config.host}/purchase/${this.props.id_purchase}`,
      method: 'patch',
      data: {
        state: state,
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      console.log(res);
      window.location.href = '/user';
    });
  }

  render() {
    return (
      <Card>
        <Card.Header as="h5">
          <Badge
            bg={this.props.state === 'creado' ? 'secondary' :
                (this.props.state === 'pagado' ? 'primary' : 'success')
            }
          >
            {this.props.state}
          </Badge>
          {` Compra en ${this.props.store}: ${this.props.product}`}
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {`Cantidad de productos comprada: ${this.props.quantity}`}
          </Card.Text>
          <Card.Text>{`Precio Unitario: $${this.props.price}`}</Card.Text>
          <Card.Text>{`Fecha: ${this.formatDate(this.props.date)}`}</Card.Text>
          <center className="mt-2">
            <ButtonGroup size="sm">
              {this.props.id_store === UserProfile.getIdStore() ?
                <Button onClick={() => this.changeState('pagado')}>
                  Marcar como pagado
                </Button> :
                  <></>
              }
              {this.props.id_user === UserProfile.getIdUser() ?
                <Button onClick={() => this.changeState('entregado')}>
                  Marcar como entregado
                </Button> :
                <></>
              }
            </ButtonGroup>
          </center>
        </Card.Body>
      </Card>
    );
  }
}

export default Order;
