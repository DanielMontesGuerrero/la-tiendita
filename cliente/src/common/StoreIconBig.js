import React, {Component} from 'react';
import {Badge, Image, Stack, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Score from './Score.js';
import StoreForm from '../user/StoreForm.js';

class UserIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  static get propTypes() {
    return {
      inSettings: PropTypes.bool,
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
        {
          this.props.inSettings ?
            <Button
              variant="link"
              onClick={() => this.setState({showModal: true})}
            >Actualizar</Button> :
            <></>
        }
        <Score score={this.props.score}/>
        <StoreForm
          show={this.state.showModal}
          onHide={() => this.setState({showModal: false})}
        />
      </Stack>
    );
  }
}

export default UserIcon;

