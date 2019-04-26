import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import ImageEye from '@material-ui/icons/RemoveRedEye';
import { linkToRecord } from 'ra-core';

import { Button, Link } from 'ra-ui-materialui';

interface ReactAdminProps {
  basePath: string;
  label: string;
  record: {
    [key: string]: any;
  };
}

const ShowButton: React.SFC<ReactAdminProps> = ({
  basePath = '',
  label = 'ra.action.show',
  record = {},
  ...rest
}) => (
  <Button
    component={Link}
    label={label}
    {...rest}
    to={`${linkToRecord(basePath, record.id)}/show`}
  >
    <ImageEye />
  </Button>
);

ShowButton.propTypes = {
  basePath: PropTypes.string,
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

export default enhance(ShowButton);
