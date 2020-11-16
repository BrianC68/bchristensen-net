import React from 'react';

const DepartmentOption = ({ department }) => {
  return (
    <option value={department.id}>{department.name}</option>
  )
}

export default DepartmentOption;
