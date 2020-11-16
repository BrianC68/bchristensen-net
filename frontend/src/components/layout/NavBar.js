import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import M from 'materialize-css/dist/js/materialize.min.js';
import { logout } from '../../actions/authActions';
import { clearCurrent, clearLists } from '../../actions/listActions';

const NavBar = ({ logout, isAuthenticated, clearCurrent, clearLists }) => {
  useEffect(() => {
  }, [isAuthenticated])

  const onLogout = () => {
    logout();
    clearCurrent();
    clearLists();
    M.toast({ html: '<strong>You have been logged out!</strong>', displayLength: 5000, classes: 'amber black-text' })
  }

  const logoutLink = (
    <Fragment>
      <li className="amber darken-2"><strong><a href="#!" className="indigo-text text-darken-4" onClick={onLogout}>Logout</a></strong></li>
    </Fragment>
  );

  const sideNavLogoutLink = (
    <Fragment>
      <li><a href="#!" className="amber-text" onClick={onLogout}><i className="far fa-sign-out-alt fa-lg amber-text"></i> Logout</a></li>
    </Fragment>
  )

  const userName = (
    <Fragment>
      <li className="indigo"><span className="amber-text nav-username"><i className="far fa-user fa-lg amber-text"></i> {localStorage.getItem('username')}</span></li>
    </Fragment>
  )

  return (
    <div>
      <nav>
        <div className="nav-wrapper grey darken-3">
          <Link to="/" className="brand-logo">
            <span className="nav-logo amber darken-2 indigo-text">BC</span>

            <span className="logo-text amber-text text-darken-2">
              <span className="amber-text">b</span>christensen
            </span>
            <span className="amber-text">.net</span>
          </Link>
          <a href="#!" data-target="mobile-side-nav" className="sidenav-trigger amber-text"><i className="material-icons">menu</i></a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><Link to="/shopping-list-api/" className="amber-text">Shopping List API</Link></li>
            <li><a href="#!" className="amber-text">Experience</a></li>
            <li><a href="#!" className="amber-text">Projects</a></li>
            {isAuthenticated ? userName : ''}
            {isAuthenticated ? logoutLink : ''}
          </ul>
        </div>
      </nav>
      <ul className="sidenav grey darken-3 sidenav-close" id="mobile-side-nav">
        <li><Link to="/" className="amber-text"><i className="far fa-home fa-lg amber-text"></i> Home</Link></li>
        <li><Link to="/shopping-list-api/" className="amber-text"><i className="far fa-list-ul fa-lg amber-text"></i> Shopping List API</Link></li>
        <li><a href="!#" className="amber-text"><i className="far fa-file-user fa-lg amber-text"></i> Experience</a></li>
        <li><a href="!#" className="amber-text"><i className="far fa-brackets-curly fa-lg amber-text"></i> Projects</a></li>
        {isAuthenticated ? sideNavLogoutLink : ''}
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
})

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool,
}

export default connect(mapStateToProps, { logout, clearCurrent, clearLists })(NavBar);
