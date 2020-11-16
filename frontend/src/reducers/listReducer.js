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
  LISTS_ERROR,
  CLEAR_LISTS_ERROR,
  CLEAR_CURRENT,
  CLEAR_LISTS,
  SET_LOADING,
} from '../actions/types';

const initialState = {
  lists: null,
  error: '',
  currentList: null,
  loading: true
}

const list = (state = initialState, action) => {
  switch (action.type) {
    case GET_LISTS:
      // console.log(action.payload);
      return {
        ...state,
        lists: action.payload,
        currentList: null,
        loading: false
      }
    case ADD_LIST:
      return {
        ...state,
        lists: [action.payload, ...state.lists],
        loading: false
      }
    case GET_LIST:
      return {
        ...state,
        currentList: action.payload[0],
        loading: false
      }
    case DELETE_LIST:
      return {
        ...state,
        lists: state.lists.filter(list => action.payload !== list.id),
        loading: false
      }
    case ADD_ITEM:
      return {
        ...state,
        currentList: {
          ...state.currentList,
          list_items: [
            ...state.currentList.list_items,
            action.payload
          ]
        },
        loading: false
      }
    case ADD_SAVED_ITEM:
      return {
        ...state,
        currentList: {
          ...state.currentList,
          list_items: [
            ...state.currentList.list_items.map(item => item.id === action.payload.id ? action.payload : item)
          ]
        },
        loading: false
      }
    case EDIT_ITEM:
      return {
        ...state,
        currentList: {
          ...state.currentList,
          list_items: [
            ...state.currentList.list_items.map(item => item.id === action.payload.id ? action.payload : item)
          ]
        },
        loading: false
      }
    case REMOVE_ITEM:
      // console.log(action.payload)
      return {
        ...state,
        currentList: {
          ...state.currentList,
          list_items: [
            // ...state.currentList.list_items
            ...state.currentList.list_items.map(item => item.id === action.payload.id ? action.payload : item)
          ]
        },
        loading: false
      }
    case DELETE_ITEM:
      return {
        ...state,
        currentList: {
          ...state.currentList,
          list_items: state.currentList.list_items.filter(item => item.id !== action.payload)

        },
        loading: false
      }
    case ADD_DEPARTMENT:
      return {
        ...state,
        currentList: {
          ...state.currentList,
          departments: [
            action.payload,
            ...state.currentList.departments
          ]
        },
        loading: false
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
      // console.error(action.payload);
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case CLEAR_LISTS_ERROR:
      return {
        ...state,
        error: ''
      }
    case SET_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return {
        ...state,
      }
  }
}

export default list;
