import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import M from 'materialize-css/dist/js/materialize.min.js';
import { register } from '../../actions/authActions';

const RegisterModal = ({ register }) => {
  const [regUsername, setUserName] = useState('');
  const [regPassword, setPassword] = useState('');

  const onRegister = () => {
    if (regUsername === '' || regPassword === '') {
      M.toast({ html: 'Please enter a username and password!' });
    } else {
      const credentials = {
        username: regUsername,
        password: regPassword
      }
      register(credentials);
      setUserName('');
      setPassword('');
    }
  }

  return (
    <div id="register-modal" className="modal">
      <div className="modal-content">
        <h4>Register</h4>
        <div className="input-field">
          <input
            type="text"
            placeholder="UserName"
            name="regUsername"
            value={regUsername}
            onChange={e => setUserName(e.target.value)}
          />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Password"
            name="regPassword"
            value={regPassword}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" onClick={onRegister} className="modal-close waves-effect indigo btn-large">Register</a>
      </div>
    </div>
  )
};

RegisterModal.propTypes = {
  register: PropTypes.func.isRequired,
}

export default connect(null, { register })(RegisterModal);
