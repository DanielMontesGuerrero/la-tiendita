import React, {Component} from 'react';
import {Badge} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './StoreIcon.css';

class ProductIcon extends Component {
  static get propTypes() {
    return {
      name: PropTypes.text,
      price: PropTypes.number,
    };
  }

  render() {
    return (
      <Badge pill bg="light" text="dark" className="storeIcon align-middle">
        <FontAwesomeIcon icon="store" size="2x"/>
        <span>{' '}{this.props.name}</span>
        {this.props.price !== undefined ?
          <span>{' | $' + this.props.price}</span> :
          <span>Hola</span>
        }
      </Badge>
    );
  }
}

export default ProductIcon;


