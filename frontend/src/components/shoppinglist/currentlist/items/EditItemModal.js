import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateItem } from '../../../../actions/listActions';
import DepartmentOption from '../departments/DepartmentOption';

const EditItemModal = ({ departments, currentListItem, updateItem }) => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    setItem(currentListItem.item);
    setQuantity(currentListItem.quantity);
    setDepartment(currentListItem.department);
  }, [currentListItem.item, currentListItem.quantity, currentListItem.department])

  const onUpdateItem = () => {
    const data = {
      id: currentListItem.id,
      user: localStorage.getItem('user_id'),
      shopping_list: currentListItem.shopping_list,
      item: item,
      quantity: quantity,
      department: department,
      on_list: true
    }
    // console.log(data)

    updateItem(data);
  }

  return (
    <div id={`edit-item-modal-${currentListItem.id}`} className="modal edit-item-modal">
      <div className="modal-content">
        <h4 className="center-align">Edit Item</h4>
        <div className="input-field">
          <input
            type="text"
            placeholder="Item Name"
            name="item"
            value={item}
            onChange={e => setItem(e.target.value)}
          />
        </div>
        <div className="input-field">
          <input
            type="number"
            placeholder="Quantity"
            name="quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </div>
        <div className="input-field col s12">
          <select
            name="department"
            value={department}
            className="browser-default"
            onChange={e => setDepartment(e.target.value)}
          >
            <option value="" disabled>Select Department or...</option>
            {departments.map(dept => <DepartmentOption department={dept} key={dept.id} />)}
          </select>
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" onClick={onUpdateItem} className="modal-close btn indigo">Update Item</a>
      </div>
    </div>
  )
}

EditItemModal.propTypes = {
  updateItem: PropTypes.func.isRequired,
}

export default connect(null, { updateItem })(EditItemModal);
