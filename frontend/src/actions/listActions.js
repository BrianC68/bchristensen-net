import axios from 'axios';
// import setAuthTokenHeader from '../utils/setAuthTokenHeader';
import {
  ADD_LIST,
  GET_LISTS,
  GET_LIST,
  CLEAR_CURRENT,
  LISTS_ERROR,
  CLEAR_LISTS
} from '../actions/types';

export const getLists = () => async dispatch => {
  // Returns all shopping lists for a particular user

  try {
    const res = await axios.get('/api/shopping-lists/');
    dispatch({
      type: GET_LISTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    });
  }
}

export const addNewList = list => async dispatch => {
  // Add a new shopping list
  const config = {
    headers: {
      'Content-Type': 'application/json',
    }
  }

  try {
    const res = await axios.post(`/api/shopping-lists/`, list, config);

    dispatch({
      type: ADD_LIST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    });
  }
}

export const getList = id => async dispatch => {
  // Return a particular shopping list
  try {
    const res = await axios.get(`/api/shopping-list/${id}/detail/`);

    dispatch({
      type: GET_LIST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    })
  }
}

export const clearCurrent = () => {
  return {
    type: CLEAR_CURRENT,
  }
}

export const clearLists = () => {
  return {
    type: CLEAR_LISTS,
  }
}
