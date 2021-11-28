import React, {Component} from 'react';
import {Badge, Image} from 'react-bootstrap';
import PropTypes from 'prop-types';
import './ProductIcon.css';

class ProductIcon extends Component {
  static get propTypes() {
    return {
      name: PropTypes.text,
      image: PropTypes.text,
    };
  }

  render() {
    return (
      <Badge pill bg="light" text="dark" className="productIcon">
        <Image src={this.props.image} roundedCircle className="mh-100"/>
        <span>{' '}{this.props.name}</span>
      </Badge>
    );
  }
}

export default ProductIcon;

