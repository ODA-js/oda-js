import * as React from 'react';
import { Component } from 'react';
import { SimpleShowLayout } from 'react-admin';
import * as PropTypes from 'prop-types';

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
 * <embeddedRefField source="items">
 *      <NumberField source="qty" />
 *      <NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
 * </embeddedRefField>
 *
 */
export class EmbeddedField extends Component {
  render() {
    const { resource, children, source, record } = this.props;
    const layoutProps = { resource, basePath: '/', record };
    return (
      <SimpleShowLayout {...layoutProps}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            record,
            source: `${source}.${child.props.source}`,
          }),
        )}
      </SimpleShowLayout>
    );
  }
}

EmbeddedField.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string,
  children: PropTypes.node.isRequired,
  data: PropTypes.object,
  label: PropTypes.string,
  record: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string.isRequired,
};

EmbeddedField.defaultProps = {
  addLabel: true,
};

export default EmbeddedField;
