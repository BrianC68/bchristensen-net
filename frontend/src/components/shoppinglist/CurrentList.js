import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CurrentListItem from './CurrentListItem';
import { clearCurrent } from '../../actions/listActions';

const CurrentList = ({ currentList, clearCurrent }) => {
  const clearCurrentList = () => {
    clearCurrent();
  }
  return (
    <div>
      <div>
        <Link to="/shopping-list-api/" onClick={clearCurrentList} className="btn indigo">Back to Lists</Link>
      </div>
      <ul className="collection with-header">
        <li className="collection-header">
          <h4>{currentList.name}</h4>
        </li>
        <li className="collection-item">
          <div className="row">
            <div className="col s3 m4">
              <strong>Item</strong>
            </div>
            <div className="col s2">
              <strong>Qty</strong>
            </div>
            <div className="col s3 m4">
              <strong>Dept.</strong>
            </div>
            <div className="col s4 m2 right-align">
              <i className="far fa-plus-square fa-2x indigo-text"></i>
            </div>
          </div>
        </li>
        {/* Only pass items that are on_list===true */}
        {currentList.list_items.filter(item => item.on_list).map(item => <CurrentListItem currentListItem={item} departments={currentList.departments} key={item.id} />)}
      </ul>
    </div>
  )
}

CurrentList.propTypes = {
  currentList: PropTypes.object.isRequired,
  clearCurrent: PropTypes.func.isRequired,
}

export default connect(null, { clearCurrent })(CurrentList);
