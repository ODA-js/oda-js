import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormField from 'admin-on-rest/lib/mui/form/FormField';
import getValue from './getValue';
import get from 'lodash/get';
import set from 'lodash/set';

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
              <FormField {...props} input={child} source={root ? `${root}.${child.props.source}` : child.props.source} name={root ? `${root}.${child.props.source}` : child.props.source} />
            </div>
          )
        })}
      </div>
    );
  }

  return (
    <div key={children.props.source} style={children.props.style} className={`aor-input-${children.props.source}`}>
      <FormField {...props} input={children} source={root ? `${root}.${children.props.source}` : children.props.source} name={root ? `${root}.${children.props.source}` : children.props.source} />
    </div>
  );
};

DependentInputComponent.propTypes = {
  record: PropTypes.object,
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
  dependsOn: PropTypes.any,
  value: PropTypes.any,
  resolve: PropTypes.func,
};

export const mapStateToProps = (state, { record, resolve, source, dependsOn, scoped = false, value }) => {
  let root = source ? source.split('.') : []; root.pop();
  root = root.join('.');

  if (resolve && (dependsOn === null || typeof dependsOn === 'undefined')) {
    let values;
    if (scoped) {
      if (root) {
        values = getValue(record, root);
      } else {
        values = record;
      }
    } else {
      values = record;
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
    formValue = dependsOn.reduce((result, curr) => {
      set(result, curr, get(record, curr));
      return result;
    }, {});
  } else {
    formValue = getValue(record, dependsOn);
  }

  if (resolve) {
    return {
      show: resolve(formValue, dependsOn),
      root,
    };
  }

  if (Array.isArray(dependsOn) && Array.isArray(value)) {
    return {
      show: dependsOn.reduce((acc, s, index) => acc && getValue(formValue, s) === value[index], true),
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
