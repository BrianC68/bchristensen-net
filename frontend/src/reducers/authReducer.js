import {
  USER_LOADED,
  AUTH_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_ERROR,
  CLEAR_MESSAGE,
  // SET_LOADING
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  user: null,
  error: '',
  message: '',
  // loading: true
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        user: {
          username: localStorage.username,
          id: localStorage.user_id
        },
        isAuthenticated: true,
        error: '',
        // loading: false
      }
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.user.username);
      localStorage.setItem('user_id', action.payload.user.id);
      return {
        ...state,
        ...action.payload,
        user: action.payload.user,
        isAuthenticated: true,
        error: '',
        message: 'You are now logged in!',
        // loading: false
      }
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
        },
        isAuthenticated: false,
        error: '',
        message: 'You may now log in to your account',
        // loading: false
      }
    case AUTH_FAIL:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        // loading: false
        // error:
      }
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        message: '',
        // loading: false
      }
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user_id');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: '',
        message: '',
        // loading: false
      }
    case CLEAR_ERROR:
      return {
        ...state,
        error: ''
      }
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: ''
      }
    default:
      return state;
  }
}

export default auth;
