<#@ context "entity" -#>
<#@ alias 'forms-form-base' -#>

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  #{content('import-from-react-admin')}
  #{slot('import-from-react-admin-form')}
} from "react-admin";

import { connect } from 'react-redux';
<#- if(entity.UI.embedded.items.filter(f=>f.single).length > 0) {#>
import { formValueSelector } from 'redux-form';
<#}#>
import compose from 'recompose/compose';
import { actions#{slot('use-action-type')} } from 'oda-ra-ui';

const initForm = actions.initForm;

const finalizeForm = actions.finalizeForm;

class Form extends Component {
  componentWillMount() {
    this.props.initForm();
  }
  componentWillUnmount() {
    this.props.finalizeForm();
  }

  render() {
    #{content('form')}
  }
}

<#- if(entity.UI.embedded.items.filter(f=>f.single).length > 0) {#>
const formName = 'record-form';
const selector = formValueSelector(formName);
<#}#>

Form.contextTypes = {
  translate: PropTypes.func.isRequired,
  initForm: PropTypes.func.isRequired,
  finalizeForm: PropTypes.func.isRequired,
}

export default compose(
  connect(
    state => ({
<# entity.UI.embedded.items.filter(f=>f.single).forEach(f=>{-#>
      #{f.name}: selector(state, '#{f.name}'),
      #{f.name}Id: selector(state, '#{f.name}Id'),
      #{f.name}Type: selector(state, '#{f.name}Type'),
<#});-#>
    }), {
      initForm: initForm('record-form', {
<#entity.UI.embedded.items.forEach(f=>{-#>
        #{f.name}: {
          resource: '#{f.entity}',
          single: #{f.single},
        },
<#});-#>
      }),
      finalizeForm,
    }),
)(Form);