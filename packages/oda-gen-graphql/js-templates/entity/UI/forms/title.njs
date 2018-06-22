<#@ context "entity" -#>
<#@ alias 'forms-title' -#>

import React from "react";
import PropTypes from 'prop-types';

const Title = ({ record },{translate}) => (
  <span>
    {translate('resources.#{entity.name}.listName', {smart_count : 1})} {record ? `"${record.#{entity.listLabel.source}}"` : ""}
  </span>
);

Title.contextTypes = {
  translate: PropTypes.func.isRequired,
}

export default Title;