<#@ context "entity" -#>
<#@ alias 'forms-base-create-edit' -#>

import React from "react";
import PropTypes from 'prop-types';
import {
  #{content('form-type')}
} from "react-admin";
import { consts } from 'oda-ra-ui';
const actionType = consts.actionType;

const #{content('form-type')}Form = (props, context) => {
  const { Form, Title } = context.uix['#{entity.role}/#{entity.name}'];
  const { translate } = context;

  return (
  <#{content('form-type')} title={<Title />} {...props}>
    <Form
      {...props}
      singleRelActions={[
        { id: actionType.CREATE, name: translate('uix.actionType.CREATE') },
        { id: actionType.UPDATE, name: translate('uix.actionType.UPDATE') },
        { id: actionType.CLONE, name: translate('uix.actionType.CLONE') },
        { id: actionType.USE, name: translate('uix.actionType.USE') },
        { id: actionType.UNLINK, name: translate('uix.actionType.UNLINK') },
      ]}
      manyRelActions={[
        { id: actionType.CREATE, name: translate('uix.actionType.CREATE') },
        { id: actionType.UPDATE, name: translate('uix.actionType.UPDATE') },
        { id: actionType.CLONE, name: translate('uix.actionType.CLONE') },
        { id: actionType.USE, name: translate('uix.actionType.USE') },
      ]}
    />
  </#{content('form-type')} >
)};

#{content('form-type')}Form.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default #{content('form-type')}Form;