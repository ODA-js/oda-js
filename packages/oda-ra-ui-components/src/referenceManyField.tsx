import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import { crudGetManyReference as crudGetManyReferenceAction } from 'ra-core/lib/actions/dataActions';
import {
  getIds,
  getReferences,
  nameRelatedTo,
} from 'ra-core/lib/reducer/admin/references/oneToMany';
import {
  SORT_ASC,
  SORT_DESC,
} from 'ra-core/lib/reducer/admin/resource/list/queryReducer';

export class ReferenceManyField extends Component {
  constructor(props) {
    super(props);
    this.state = { sort: props.sort };
  }

  componentDidMount() {
    this.fetchReferences();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.record.id !== nextProps.record.id) {
      this.fetchReferences(nextProps);
    }
  }

  setSort = field => {
    const order =
      this.state.sort.field === field &&
        this.state.sort.order === SORT_ASC
        ? SORT_DESC
        : SORT_ASC;
    this.setState({ sort: { field, order } }, this.fetchReferences);
  };

  fetchReferences(
    { reference, record, resource, target, perPage, filter, idKey } = this.props
  ) {
    const { crudGetManyReference } = this.props;
    const pagination = { page: 1, perPage };
    const relatedTo = nameRelatedTo(
      reference,
      record.id,
      resource,
      target,
      filter
    );
    crudGetManyReference(
      reference,
      target,
      record[idKey],
      relatedTo,
      pagination,
      this.state.sort,
      filter
    );
  }

  render() {
    const {
      resource,
      reference,
      data,
      ids,
      children,
      basePath,
      isLoading,
    } = this.props;
    if (React.Children.count(children) !== 1) {
      throw new Error(
        '<ReferenceManyField> only accepts a single child (like <Datagrid>)'
      );
    }
    if (typeof ids === 'undefined') {
      return <LinearProgress style={{ marginTop: '1em' }} />;
    }
    const referenceBasePath = basePath.replace(resource, reference); // FIXME obviously very weak
    return React.cloneElement(children, {
      resource: reference,
      ids,
      data,
      isLoading,
      basePath: referenceBasePath,
      currentSort: this.state.sort,
      setSort: this.setSort,
    });
  }
}

ReferenceManyField.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  crudGetManyReference: PropTypes.func.isRequired,
  filter: PropTypes.object,
  ids: PropTypes.array,
  label: PropTypes.string,
  perPage: PropTypes.number,
  record: PropTypes.object,
  reference: PropTypes.string.isRequired,
  data: PropTypes.object,
  resource: PropTypes.string.isRequired,
  sort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.oneOf(['ASC', 'DESC']),
  }),
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  idKey: PropTypes.string,
};

ReferenceManyField.defaultProps = {
  filter: {},
  perPage: 25,
  sort: { field: 'id', order: 'DESC' },
  source: '',
  idKey: 'id'
};

function mapStateToProps(state, props) {
  const relatedTo = nameRelatedTo(
    props.reference,
    props.record.id,
    props.resource,
    props.target,
    props.filter
  );
  return {
    data: getReferences(state, props.reference, relatedTo),
    ids: getIds(state, relatedTo),
    isLoading: state.admin.loading > 0,
  };
}

const ConnectedReferenceManyField = connect(mapStateToProps, {
  crudGetManyReference: crudGetManyReferenceAction,
})(ReferenceManyField);

ConnectedReferenceManyField.defaultProps = {
  addLabel: true,
  source: '',
};

export default ConnectedReferenceManyField;
