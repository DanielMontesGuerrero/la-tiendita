import React, {Component} from 'react';
import {Badge, Image, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const UserTypes = {
  user: 'usuario',
  vendor: 'vendedor',
  admin: 'admin',
};

class UserIcon extends Component {
  static get propTypes() {
    return {
      userType: PropTypes.string,
      image: PropTypes.string,
      name: PropTypes.string,
    };
  }

  getBadge() {
    let color = 'secondary';
    if (this.props.userType === UserTypes.vendor) {
      color = 'success';
    } else if (this.props.userType === UserTypes.admin) {
      color = 'danger';
    }
    return (
      <Badge bg={color} className="mt-3">{this.props.userType}</Badge>
    );
  }

  render() {
    return (
      <Stack>
        <Badge bg="dark" className="mb-3">{this.props.name}</Badge>
        <center>
          {
            this.props.image !== null && this.props.image !== undefined ?
              <Image
                src={this.props.image}
                style={{maxWidth: 150}}
                rounded
              /> :
                <FontAwesomeIcon icon="user" size="10x"/>
          }
        </center>
        {this.getBadge()}
      </Stack>
    );
  }
}

export default UserIcon;
