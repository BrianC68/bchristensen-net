import React, { useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import NavBar from './components/layout/NavBar';
import Home from './components/pages/Home';
import ShoppingList from './components/pages/ShoppingList';
import store from './store';
import setAuthTokenHeader from './utils/setAuthTokenHeader';

if (localStorage.token) {
  setAuthTokenHeader(localStorage.token);
}

const App = () => {
  useEffect(() => {
    // Initializes Materialize JS
    M.AutoInit();
  });

  return (
    <Provider store={store}>
      <Fragment>
        <Router>
          <NavBar />
          <div className="container">
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/shopping-list-api/' component={ShoppingList} />
            </Switch>
          </div>
        </Router>
      </Fragment>
    </Provider>
  );
}

export default App;
