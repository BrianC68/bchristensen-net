import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import M from 'materialize-css/dist/js/materialize.min.js';
import { addNewList } from '../../actions/listActions';

const NewListModal = ({ addNewList }) => {
  const [listName, setListName] = useState('');
  const userID = localStorage.getItem('user_id');

  const onSubmit = () => {
    if (listName === '') {
      M.toast({ html: '<strong>Please enter a name for your new list!</strong>', classes: "red lighten-3 black-text" });
    } else {
      const newList = {
        user: userID,
        name: listName
      }
      addNewList(newList);
      setListName('');
    }
  }

  return (
    <div id="new-list-modal" className="modal">
      <div className="modal-content">
        <h4>New Shopping List</h4>
        <div className="input-field">
          <input
            type="text"
            placeholder="Enter List or Store Name"
            name="name"
            value={listName}
            onChange={e => setListName(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-footer">
        <a href="#!" onClick={onSubmit} className="modal-close waves-effect indigo btn-large">Submit</a>
      </div>
    </div>
  )
}

NewListModal.propTypes = {
  addNewList: PropTypes.func.isRequired,
}

export default connect(null, { addNewList })(NewListModal);