import React from 'react';
import PropTypes from 'prop-types';

class SignupForm extends React.Component {
  state = {
    username: '',
    password: '',
    type: 'farmer'
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
      <form onSubmit={e => this.props.handle_signup(e, this.state)} style={{border:"2px solid brown",width:"300px",margin: " 20px auto",padding:"10px"}}>
        <h4>Sign Up</h4>
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
          style={{height:"30px" ,margin:"20px"}}
        />
        <label htmlFor="type">Sign up as:</label>

        <select id="type" name="type" value="farmer" onChange={this.handle_change}>
          <option value="farmer">Farmer</option>
          <option value="distributor">Distributor</option>
          <option value="customer">Customer</option>
         
        </select>

        <input type="submit" style={{display:"block" ,margin:"auto",height:"30px"}}/>
      </form>
    );
  }
}

export default SignupForm;

SignupForm.propTypes = {
  handle_signup: PropTypes.func.isRequired
};