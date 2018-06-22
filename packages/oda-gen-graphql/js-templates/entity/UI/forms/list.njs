<#@ context "entity" -#>
<#@ alias 'forms-list' -#>

import React from "react";
import PropTypes from 'prop-types';
import {
  List,
} from "react-admin";

const ListView = (props, context) => {
  const { Grid, Filter } = context.uix['#{entity.role}/#{entity.name}'];

  return (
    <List {...props} filters={<Filter />} title={context.translate("resources.#{entity.name}.name", { smart_count:2 })}>
      <Grid {...props} />
    </List>
  )
};

ListView.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default ListView;