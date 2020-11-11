import {
  ADD_LIST,
  GET_LISTS,
  GET_LIST,
  LISTS_ERROR,
  CLEAR_CURRENT,
  CLEAR_LISTS,
} from '../actions/types';

const initialState = {
  lists: null,
  error: '',
  currentList: null,
}

const list = (state = initialState, action) => {
  switch (action.type) {
    case GET_LISTS:
      // console.log(action.payload);
      return {
        ...state,
        lists: action.payload,
        currentList: null
      }
    case ADD_LIST:
      return {
        ...state,
        lists: [action.payload, ...state.lists],
      }
    case GET_LIST:
      return {
        ...state,
        currentList: action.payload[0]
      }
    case CLEAR_CURRENT:
      return {
        ...state,
        currentList: null
      }
    case CLEAR_LISTS:
      return {
        ...state,
        lists: null,
      }
    case LISTS_ERROR:
      console.error(action.payload);
      return {
        ...state,
        error: action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}

export default list;
