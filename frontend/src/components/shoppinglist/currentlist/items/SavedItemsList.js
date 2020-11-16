import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addSavedItem, deleteItem } from '../../../../actions/listActions';

const SavedItemsList = ({ addSavedItem, item, deleteItem }) => {
  const onAddToList = () => {
    item.on_list = true;
    const data = item;

    addSavedItem(data);
  }

  const onDeleteItem = () => {
    const confirmDelete = window.confirm(`${item.item} will be permanently deleted from your shopping list! Proceed?`);
    if (confirmDelete) {
      deleteItem(item.id);
    }
  }

  return (
    <li className="collection-item">
      <div className="row">
        <div className="col s8 m10">
          {item.item}
        </div>
        <div className="col s2 m1">
          <a href="#!" onClick={onAddToList}>
            <i className="far fa-plus-square fa-lg indigo-text"></i></a>
        </div>
        <div className="col s2 m1">
          <a href="#!" onClick={onDeleteItem}>
            <i className="fas fa-trash-alt fa-lg indigo-text"></i></a>
        </div>
      </div>
    </li>
  )
};

SavedItemsList.propTypes = {
  addSavedItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
}

export default connect(null, { addSavedItem, deleteItem })(SavedItemsList);
