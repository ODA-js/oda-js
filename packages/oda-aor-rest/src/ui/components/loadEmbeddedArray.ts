import { connect } from 'react-redux';
import compose from 'recompose/compose';
import * as get from 'lodash/get';

import { crudGetManyAccumulate as crudGetManyAccumulateAction } from 'admin-on-rest/lib/actions/accumulateActions';

export const getReferences = (state, reference, ids) => {
  if (ids.length === 0) return [];
  let idsMap = ids.map(id => state.admin.resources[reference].data[id])
    .filter(r => typeof r !== 'undefined')
    .reduce((prev, record) => {
      prev[record.id] = record; // eslint-disable-line no-param-reassign
      return prev;
    }, {});
  let result = ids.map(f => idsMap[f] || f);
  return result;
};

const emptyIds = [];

export default compose(
  connect((state, props) => {
    const { record, source, reference, field = 'id', ...rest } = props;
    if (reference) {
      const ids =
        (get(record, source) || emptyIds)
          .map(f => typeof f === 'object' ? f[field] : f);
      let data = getReferences(state, reference, ids);

      return {
        ...rest,
        ids,
        isLoading: state.admin.loading > 0,
        record: data ? Object.assign({}, record, { [source]: data }) : record,
      }
    } else { return props; }
  }, {
      crudGetManyAccumulate: crudGetManyAccumulateAction,
    })
);
