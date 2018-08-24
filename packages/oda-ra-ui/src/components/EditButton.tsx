import * as React from 'react';
import * as PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import ContentCreate from '@material-ui/icons/Create';
import { linkToRecord } from 'ra-core';

import { Button, Link } from 'ra-ui-materialui';

const EditButton: React.SFC<{
  basePath: string;
  label: string;
  className: string;
  classes: object;
  record: { [key: string]: any };
}> = ({ basePath = '', label = 'ra.action.edit', record = {}, ...rest }) => (
  <Button
    component={Link}
    label={label}
    {...rest}
    to={linkToRecord(basePath, record.id)}
  >
    <ContentCreate />
  </Button>
);

EditButton.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  label: PropTypes.string,
  record: PropTypes.object,
};

const enhance = shouldUpdate(
  (props, nextProps) =>
    props.translate !== nextProps.translate ||
    (props.record &&
      nextProps.record &&
      props.record.id !== nextProps.record.id) ||
    props.basePath !== nextProps.basePath ||
    (props.record == null && nextProps.record != null),
);

export default enhance(EditButton);
