import React from 'react';

import ReactJson from 'react-json-view';
import { Field } from 'redux-form';
import { Labeled } from 'react-admin';

const JSONInput: any = props => (
  <Field
    name={props.source}
    {...props}
    component={props => (
      <Labeled label={props.label}>
        <ReactJson
          {...props}
          src={(props.input && props.input.value) || {}}
          onEdit={e => props.input && props.input.onChange(e.updated_src)}
          onAdd={e => props.input && props.input.onChange(e.updated_src)}
        />
      </Labeled>
    )}
  />
);

// JSONInput.defaultProps = {
//   addLabel: true,
// };

export default JSONInput;
