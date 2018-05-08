import { crudGetManyAccumulate as crudGetManyAccumulateAction } from 'ra-core/lib/actions/accumulateActions';
import * as get from 'lodash/get';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

export const getReferences = (state, reference, id) => {
  if (!id) return id;
  return state.admin.resources[reference].data[id]
};

export default compose(
  connect((state, props) => {
    const { record, source, reference, field = 'id', ...rest } = props;
    if (reference) {
      const id = get(record, source);
      let data = id ? getReferences(state, reference, id) : null;

      return {
        ...rest,
        id,
        isLoading: state.admin.loading > 0,
        record: data ? Object.assign({}, record, { [source]: data }) : record,
      }
    } else {
      return props;
    }
  }, {
      crudGetManyAccumulate: crudGetManyAccumulateAction,
    })
);
