import axios from 'axios';

const setAuthTokenHeader = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authoriztion'];
  }
}

export default setAuthTokenHeader
