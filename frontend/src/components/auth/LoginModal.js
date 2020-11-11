import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import M from 'materialize-css/dist/js/materialize.min.js';
import { login } from '../../actions/authActions';

const LoginModal = ({ login }) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    if (username === '' || password === '') {
      M.toast({ html: 'Please enter both your username and password!' });
    } else {
      const credentials = {
        username: username,
        password: password
      }
      login(credentials);
      setUserName('');
      setPassword('');
    }
  }

  return (
    <div id="login-modal" className="modal">
      <div className="modal-content">
        <h4>Login</h4>
        <div className="input-field">
          <input
            type="text"
            placeholder="UserName"
            name="username"
            value={username}
            onChange={e => setUserName(e.target.value)}
          />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" onClick={onLogin} className="modal-close waves-effect indigo btn-large">Login</a>
      </div>
    </div>
  )
}

LoginModal.propTypes = {
  login: PropTypes.func.isRequired,
}

export default connect(null, { login })(LoginModal);
