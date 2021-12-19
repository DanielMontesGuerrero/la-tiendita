import React, {Component} from 'react';
import {Badge, Image, Stack} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Score from './Score.js';

class UserIcon extends Component {
  static get propTypes() {
    return {
      name: PropTypes.string,
      image: PropTypes.string,
      score: PropTypes.number,
    };
  }

  render() {
    return (
      <Stack gap={2}>
        <Badge
          bg="dark">
          {this.props.name}
        </Badge>
        <center>
          {
            this.props.image !== null && this.props.image !== undefined ?
              <Image
                src={this.props.image}
                style={{maxWidth: 150}}
                rounded
              /> :
                <FontAwesomeIcon icon="store" size="10x"/>
          }
        </center>
        <Score score={this.props.score}/>
      </Stack>
    );
  }
}

export default UserIcon;

