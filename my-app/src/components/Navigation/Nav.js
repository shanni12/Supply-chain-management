import React from 'react';
import PropTypes from 'prop-types';
import classes from './Navigation.module.css';
function Nav(props) {
  const logged_out_nav = (
    <div className={classes.Navigation}>
      
      <div onClick={() => props.display_form('login')} className={classes.NavigationItem}>Login</div>
      <div onClick={() => props.display_form('signup')} className={classes.NavigationItem}>Signup</div>
    </div>
  );

  const logged_in_nav = (
    <div className={classes.Navigation}>
      <div onClick={props.handle_logout} className={classes.NavigationItem}>Logout</div>
    </div>
  );
  return <div>{props.logged_in ? logged_in_nav : logged_out_nav}</div>;
}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};