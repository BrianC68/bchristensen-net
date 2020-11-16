import axios from 'axios';
// import setAuthTokenHeader from '../utils/setAuthTokenHeader';
import {
  ADD_LIST,
  GET_LISTS,
  GET_LIST,
  DELETE_LIST,
  ADD_ITEM,
  ADD_SAVED_ITEM,
  EDIT_ITEM,
  REMOVE_ITEM,
  DELETE_ITEM,
  ADD_DEPARTMENT,
  CLEAR_CURRENT,
  LISTS_ERROR,
  CLEAR_LISTS_ERROR,
  CLEAR_LISTS,
  SET_LOADING
} from '../actions/types';

const jsonHeader = {
  headers: {
    'Content-Type': 'application/json',
  }
}

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

  try {
    const res = await axios.post(`/api/shopping-lists/`, list, jsonHeader);

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

export const deleteList = id => async dispatch => {
  // Permanently delete a list
  try {
    await axios.delete(`/api/shopping-list/${id}`);

    dispatch({
      type: DELETE_LIST,
      payload: id
    });
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    });
  }
}

export const addItem = data => async dispatch => {
  // Adds a new item to the currentList

  try {
    const res = await axios.post(`/api/shopping-list/${data.shopping_list}/items/`, data, jsonHeader);

    dispatch({
      type: ADD_ITEM,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    });
  }
}

export const addSavedItem = data => async dispatch => {
  // Set on_list to true for a saved item

  try {
    const res = await axios.put(`/api/shopping-list/item/${data.id}/`, data, jsonHeader);

    dispatch({
      type: ADD_SAVED_ITEM,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    })
  }
}

export const updateItem = data => async dispatch => {
  try {
    const res = await axios.put(`/api/shopping-list/item/${data.id}/`, data, jsonHeader);

    dispatch({
      type: EDIT_ITEM,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    })
  }
}

export const removeItemFromList = (data, id) => async dispatch => {
  // Set on_list to false

  try {
    const res = await axios.put(`/api/shopping-list/item/${id}/`, JSON.stringify(data), jsonHeader);

    dispatch({
      type: REMOVE_ITEM,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    })
  }
}

export const deleteItem = (id) => async dispatch => {
  try {
    await axios.delete(`/api/shopping-list/item/${id}/`);
    dispatch({
      type: DELETE_ITEM,
      payload: id
    })
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    })
  }
}

export const addDepartment = (data) => async dispatch => {
  try {
    const res = await axios.post(`/api/shopping-list/${data.shopping_list}/depts/`, data, jsonHeader);

    dispatch({
      type: ADD_DEPARTMENT,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: LISTS_ERROR,
      payload: err.response.data
    })
  }
}

export const clearCurrent = () => dispatch => {
  dispatch({
    type: CLEAR_CURRENT,
  })
}

export const clearLists = () => dispatch => {
  dispatch({
    type: CLEAR_LISTS,
  })
}

export const clearListsError = () => dispatch => {
  dispatch({
    type: CLEAR_LISTS_ERROR,
  })
}

export const setLoading = () => dispatch => {
  dispatch({ type: SET_LOADING })
}
