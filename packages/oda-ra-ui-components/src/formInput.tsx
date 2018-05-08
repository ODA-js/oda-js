import * as React from 'react';
import FormField from 'ra-core/lib/form/FormField';

const FormInput = ({ input, ...rest }) => {
  if (input) {
    const current = React.cloneElement(input, rest);
    return (
      <div
        className={`aor-input aor-input-${current.props.source}`}
        style={current.props.style}
      >
        <FormField input={current} />
      </div>
    )
  } else {
    return null;
  }
}

export default FormInput;
