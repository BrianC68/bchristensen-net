import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import M from 'materialize-css/dist/js/materialize.min.js';
import LoginBtn from '../auth/LoginBtn';
import LoginModal from '../auth/LoginModal';
import RegisterBtn from '../auth/RegisterBtn';
import RegisterModal from '../auth/RegisterModal';
import IntroText from '../shoppinglist/IntroText';
import ShoppingLists from '../shoppinglist/ShoppingLists';
import { loadUser, clearError, clearMessage } from '../../actions/authActions';

const ShoppingList = ({ isAuthenticated, loadUser, message, error, clearError, clearMessage }) => {
  useEffect(() => {
    loadUser();
    M.AutoInit();

    if (message !== '') {
      M.toast({ html: `<strong>${message}</strong>`, displayLength: 6000, classes: "amber black-text" });
      clearMessage();
    }
    if (error !== '') {
      M.toast({ html: `<strong>${error}</strong>`, displayLength: 6000, classes: "red lighten-3 black-text" });
      clearError();
    }
  });

  return (
    <Fragment>
      <div>
        {/* Content shown when user is not logged in */}
        {isAuthenticated ? '' : <IntroText />}
        {isAuthenticated ? '' : <LoginBtn />}
        {isAuthenticated ? '' : <LoginModal />}
        {isAuthenticated ? '' : <RegisterBtn />}
        {isAuthenticated ? '' : <RegisterModal />}
        {/* Content shown when user is logged in */}
        {isAuthenticated ? <ShoppingLists /> : ''}
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  message: state.auth.message,
  error: state.auth.error,
})

ShoppingList.propTypes = {
  isAuthenticated: PropTypes.bool,
  loadUser: PropTypes.func.isRequired,
  message: PropTypes.string,
  error: PropTypes.string,
  clearMessage: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { loadUser, clearError, clearMessage })(ShoppingList);
