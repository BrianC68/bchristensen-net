import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import M from 'materialize-css/dist/js/materialize.min.js';
import { addDepartment } from '../../../../actions/listActions';

const AddDepartmentModal = ({ addDepartment, currentListID }) => {
  const [department, setDepartment] = useState('');

  const onAddDept = () => {
    if (department === '') {
      M.toast({ html: '<strong>Please enter a department name</strong>', displayLength: 6000, classes: "red lighten-3 black-text" })
    } else {
      const data = {
        user: localStorage.getItem('user_id'),
        name: department,
        shopping_list: currentListID
      }
      addDepartment(data);
      M.toast({ html: `<strong>${department} has been added to the select list</strong>`, displayLength: 6000, classes: "amber black-text" })
      setDepartment('');
    }
  }

  return (
    <div id="add-dept-modal" className="modal">
      <div className="modal-content">
        <h4 className="center-align">Add Department</h4>
        <div className="input-field">
          <input
            type="text"
            placeholder="Department"
            name="department"
            value={department}
            onChange={e => setDepartment(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" onClick={onAddDept} className="modal-close btn indigo">Submit</a>
      </div>
    </div>
  )
}

AddDepartmentModal.propTypes = {
  addDepartment: PropTypes.func.isRequired,
}

export default connect(null, { addDepartment })(AddDepartmentModal);
