import React from 'react';

const CurrentListItem = ({ currentListItem, departments }) => {
  const getDeptName = (id) => {
    let dept = departments.filter(dept => dept.id === id)
    return dept[0].name;
  }

  return (
    <li className="collection-item">
      <div className="row">
        <div className="col s3 m4">
          {currentListItem.item}
        </div>
        <div className="col s2">
          {currentListItem.quantity}
        </div>
        <div className="col s3 m4">
          {getDeptName(currentListItem.department)}
        </div>
        {/* <div className="col s2"></div> */}
        <div className="col s2 m1">
          <i className="far fa-edit fa-lg indigo-text"></i>
        </div>
        <div className="col s2 m1">
          <i className="fas fa-trash-alt fa-lg indigo-text"></i>
        </div>
      </div>
    </li>
  )
}

export default CurrentListItem;
