import * as React from 'react';
import { get } from 'lodash';
import ReactJson from 'react-json-view';

const JSONField: any = ({ source, record = {} }) => {
  const data = get(record, source);
  return data ? <ReactJson src={data} /> : <span />;
};

JSONField.defaultProps = {
  addLabel: true,
};

export default JSONField;
