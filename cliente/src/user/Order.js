import React, {Component} from 'react';
import {Card, Badge} from 'react-bootstrap';
import PropTypes from 'prop-types';

class Order extends Component {
  static get propTypes() {
    return {
      product: PropTypes.text,
      store: PropTypes.text,
      quantity: PropTypes.number,
      price: PropTypes.number,
      date: PropTypes.text,
      state: PropTypes.text,
    };
  }

  render() {
    return (
      <Card>
        <Card.Header as="h5">
          {`Compra en ${this.props.store}: ${this.props.product}`}
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <p>{`Cantidad de productos comprada: ${this.props.quantity}`}</p>
            <p>{`Precio: $${this.props.price}`}</p>
            <p>{`Fecha: $${this.props.date}`}</p>
          </Card.Text>
          <Badge
            bg={this.props.state === 'creado' ? 'secondary' :
                (this.props.state === 'pagado' ? 'primary' : 'success')
            }
          >
            {this.props.state}
          </Badge>
        </Card.Body>
      </Card>
    );
  }
}

export default Order;
