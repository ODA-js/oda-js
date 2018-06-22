<#@ context "entity" -#>
<#@ alias 'forms-grid' -#>

import React from "react";
import PropTypes from 'prop-types';

import {
  Responsive,
} from "react-admin";

const Grid = (props, context) => {
  const { CardView, GridView } = context.uix['#{entity.role}/#{entity.name}'];
  return (
  <Responsive
    small={<CardView {...props} />}
    medium={<GridView {...props} />}
  />
);
}

Grid.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default Grid;