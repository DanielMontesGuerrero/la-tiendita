import {Component} from 'react';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import './Score.css';

class Score extends Component {
  static get propTypes() {
    return {
      score: PropTypes.number,
    };
  }

  genStars() {
    const numStars = Math.round(this.props.score);
    return Array.from(Array(5)).map((item, index) => {
      const color = (index + 1) <= numStars ? 'rating-color' : 'null-color';
      return (
        <FontAwesomeIcon icon="star" className={color} key={index}/>
      );
    });
  }
  render() {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div>
          {this.genStars()}
        </div>
        <span className="algin-middle fw-bold ml-2">{this.props.score}</span>
      </div>
    );
  }
}

export default Score;

