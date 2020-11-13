import React from 'react';
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
  state = {
    username: '',
    password: ''
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
      <form onSubmit={e => this.props.handle_login(e, this.state)} style={{border:"2px solid brown",width:"300px",margin: " 20px auto",padding:"10px"}}>
        <h4>Log In</h4>
        <label htmlFor="username" style={{display:"block"}}>Username</label>
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handle_change}
          style={{height:"30px",margin:"20px"}}
        />
        <label htmlFor="password" style={{display:"block"}}>Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
          style={{height:"30px" ,margin:"20px auto",display:"block"}}
        />
        <button type="submit" onClick={e=>this.props.handle_login(e,this.state)}>Log in</button>
      </form>
    );
  }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};