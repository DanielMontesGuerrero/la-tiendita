import React, {Component} from 'react';
import NavigationBar from '../common/NavigationBar.js';
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';

const actions = {
  LOGIN: "login",
  REGISTER: "register",
}

class Login extends Component {
  state = {
    action: actions.LOGIN,
  };
  toggleAction() {
    console.log('toggleAction');
    this.setState((prevState, prevProps) => {
      let newAction = actions.LOGIN;
      if(prevState.action === actions.LOGIN){
        newAction = actions.REGISTER;
      }
      return { action: newAction };
    });
  };

  render () {
    return (
      <div>
        <NavigationBar/>
        <br/>
        {this.state.action === actions.LOGIN ? <LoginForm toggleAction={() => this.toggleAction()}/> : <RegisterForm toggleAction={() => this.toggleAction()}/>}
      </div>
    );
  }
}

export default Login;
