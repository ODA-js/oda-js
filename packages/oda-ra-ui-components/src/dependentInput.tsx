import * as React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { formValueSelector, getFormValues } from 'redux-form';

import FormInput from './formInput';
import getValue from './getValue';

const REDUX_FORM_NAME = 'record-form';
export const DependentInputComponent = ({ children, show, root, ...props }) => {
  if (!show) {
    return null;
  }

  if (Array.isArray(children)) {
    return (
      <div>
        {React.Children.map(children, child => {
          return (
            <div
              key={child.props.source}
              style={child.props.style}
              className={`aor-input-${child.props.source}`}
            >
              <FormInput {...props} input={child} source={root ? `${root}.${child.props.source}` : child.props.source} name={root ? `${root}.${child.props.source}` : child.props.source} />
            </div>
          )
        })}
      </div>
    );
  }

  return (
    <div key={children.props.source} style={children.props.style} className={`aor-input-${children.props.source}`}>
      <FormInput {...props} input={children} source={root ? `${root}.${children.props.source}` : children.props.source} name={root ? `${root}.${children.props.source}` : children.props.source} />
    </div>
  );
};

DependentInputComponent.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
  dependsOn: PropTypes.any,
  value: PropTypes.any,
  resolve: PropTypes.func,
  formName: PropTypes.string,
};

export const mapStateToProps = (state, { resolve, source, dependsOn, scoped = false, value, formName = REDUX_FORM_NAME }) => {
  let root = source ? source.split('.') : []; root.pop();
  root = root.join('.');

  if (resolve && (dependsOn === null || typeof dependsOn === 'undefined')) {
    let values;
    if (scoped) {
      if (root) {
        values = formValueSelector(formName)(state, root);
      } else {
        values = getFormValues(formName)(state);
      }
    } else {
      values = getFormValues(formName)(state);
    }

    return {
      show: resolve(values, dependsOn, value),
      root,
    };
  }

  let formValue;
  // get the current form values from redux-form
  if (Array.isArray(dependsOn)) {
    // We have to destructure the array here as redux-form does not accept an array of fields
    formValue = formValueSelector(formName)(state, ...dependsOn);
  } else {
    formValue = formValueSelector(formName)(state, dependsOn);
  }

  if (resolve) {
    return {
      show: resolve(formValue, dependsOn),
      root,
    };
  }

  if (Array.isArray(dependsOn) && Array.isArray(value)) {
    return {
      show: dependsOn.reduce((acc, s, index) => acc && get(formValue, s) === value[index], true),
      root,
    };
  }

  if (typeof value === 'undefined') {
    if (Array.isArray(dependsOn)) {
      return {
        show: dependsOn.reduce((acc, s) => acc && !!getValue(formValue, s), true),
        root,
      };
    }

    return {
      show: !!formValue,
      root,
    };
  }

  return {
    show: formValue === value,
    root,
  };
};

export default connect(mapStateToProps)(DependentInputComponent);
