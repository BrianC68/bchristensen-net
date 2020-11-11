import axios from 'axios';

const setAuthTokenHeader = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default setAuthTokenHeader;
