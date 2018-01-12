import * as React from 'react';
import { Component } from 'react';
import { EmbeddedArrayField as Extendee } from 'aor-embedded-array';
import * as PropTypes from 'prop-types';

import dataLoadWrapper from './loadEmbeddedArray';

/**
 * A container component that shows embedded array elements as a list of input sets
 *
 * You must define the fields and pass them as children.
 *
 * @example Display all the items of an order
 * // order = {
 * //   id: 123,
 * //   items: [
 * //       { qty: 1, price: 10 },
 * //       { qty: 3, price: 15 },
 * //   ],
 * // }
 * <EmbeddedArrayField source="items">
 *      <NumberField source="qty" />
 *      <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 * </EmbeddedArrayField>
 *
 */
export class EmbeddedArrayField extends Extendee {

  componentDidMount() {
    this.fetchReferences();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.record.id !== nextProps.record.id) {
      this.fetchReferences(nextProps);
    }
  }

  fetchReferences({ crudGetManyAccumulate, reference, ids } = this.props) {
    crudGetManyAccumulate(reference, ids);
  }
}

const Wrapped = dataLoadWrapper(EmbeddedArrayField);

Wrapped.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string,
  children: PropTypes.node.isRequired,
  data: PropTypes.array,
  label: PropTypes.string,
  record: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string.isRequired,
  target: PropTypes.string,
  reference: PropTypes.string,
  field: PropTypes.string,
};

Wrapped.defaultProps = {
  addLabel: true,
};

export default Wrapped;
