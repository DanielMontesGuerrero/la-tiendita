import logo from '../logo.svg';
import React from 'react';
import './Home.css';
import {Component} from 'react';
import NavigationBar from '../common/NavigationBar.js';

class Home extends Component {
  render() {
    return (
      <div>
        <NavigationBar/>
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <p>
            En construcción U.U
          </p>
          <a
            className="Home-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default Home;
