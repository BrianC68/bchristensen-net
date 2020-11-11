import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLists } from '../../actions/listActions';
import ShoppingListsItem from './ShoppingListsItem';
import NewListModal from './NewListModal';
import CurrentList from './CurrentList';

const ShoppingLists = ({ list: { lists, error, currentList }, getLists }) => {
  useEffect(() => {
    getLists();
  }, [getLists]);

  if (error) {
    console.error(error);
  }

  return (
    <div>
      {currentList !== null ? <CurrentList currentList={currentList} /> :
        <div className="my-shopping-lists">
          <h3>My Shapping Lists</h3>
          <div className="shopping-list-btn-div">
            <a href="#new-list-modal" className="amber darken-3 black-text btn-large waves-effect waves-light modal-trigger"><strong>New List</strong></a>
          </div>
          <NewListModal />
          {lists === null || lists.length === 0 ? <p>No lists to show....</p> :
            lists.map(list => <ShoppingListsItem list={list} key={list.id} />)}
        </div>
      }
    </div>
  )
}

ShoppingLists.propTypes = {
  getLists: PropTypes.func.isRequired,
  list: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  list: state.list,
});

export default connect(mapStateToProps, { getLists })(ShoppingLists);
