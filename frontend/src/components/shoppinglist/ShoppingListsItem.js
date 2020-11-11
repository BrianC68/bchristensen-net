import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getList } from '../../actions/listActions';

const ShoppingListsItem = ({ list, getList }) => {
  const onGetList = () => {
    getList(list.id);
  }
  return (
    <div>
      <div className="shopping-list-btn-div">
        <a href="#!" onClick={onGetList} className="indigo btn-large waves-effect waves-light">
          {list.name}
        </a>
      </div>
    </div>
  )
}

ShoppingListsItem.propTypes = {
  list: PropTypes.object.isRequired,
  getList: PropTypes.func.isRequired,
}

export default connect(null, { getList })(ShoppingListsItem);