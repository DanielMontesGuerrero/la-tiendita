import React, {Component} from 'react';
import {Badge, Image} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './StoreIcon.css';

class ProductIcon extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string,
      price: PropTypes.number,
      image: PropTypes.string,
    };
  }

  render() {
    return (
      <Badge pill bg="light" text="dark" className="storeIcon align-middle">
        {
          this.props.image !== null && this.props.image !== undefined ?
            <Image src={this.props.image} style={{maxWidth: 50}}
              roundedCircle/> :
            <FontAwesomeIcon icon="store" size="2x"/>
        }
        <span>{' '}{this.props.name}</span>
        {this.props.price !== undefined ?
          <span>{' | $' + this.props.price}</span> :
          <span></span>
        }
      </Badge>
    );
  }
}

export default ProductIcon;


