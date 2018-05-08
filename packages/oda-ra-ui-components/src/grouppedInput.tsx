import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { translate } from 'react-admin';
import * as inflection from 'inflection';
import { Field } from 'redux-form';

import EmbeddedArrayInputFormField from './embeddedArrayInputFormField';
import Label from './label';
import styles from './styles';

/**
 * An Input component for generating/editing an embedded array
 *
 *
 * Use it with any set of input componentents as children, like `<TextInput>`,
 * `<SelectInput>`, `<RadioButtonGroupInput>` ... etc.
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *              <GrouppedInput source="links">
 *                  <TextInput source="url" />
 *                  <TextInput source="context"/>
 *                  <ReferenceInput resource="tags" reference="tags" source="tag_id" >
 *                      <SelectInput optionText="name" />
 *                  </ReferenceInput>
 *               </GrouppedInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export class GrouppedInput extends Component {
  static propTypes = {
    addLabel: PropTypes.bool.isRequired,
    addField: PropTypes.bool.isRequired,
    allowEmpty: PropTypes.bool.isRequired,
    allowAdd: PropTypes.bool.isRequired,
    allowRemove: PropTypes.bool.isRequired,
    arrayElStyle: PropTypes.object,
    basePath: PropTypes.string,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    label: PropTypes.string,
    labelAdd: PropTypes.string.isRequired,
    labelRemove: PropTypes.string.isRequired,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    resource: PropTypes.string,
    readOnly: PropTypes.bool,
    record: PropTypes.object,
    source: PropTypes.string,
  };

  static defaultProps = {
    addLabel: false,
    addField: false,
    allowEmpty: true,
    allowAdd: true,
    allowRemove: true,
    labelAdd: 'aor.input.embedded_array.add',
    labelRemove: 'aor.input.embedded_array.remove',
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  renderListItem = ({ allowRemove, inputs, member, translate, labelRemove, readOnly, disabled }) => {
    const passedProps = {
      resource: this.props.resource,
      basePath: this.props.basePath,
      record: this.props.record,
    };
    return (
      <div className="EmbeddedArrayInputItemContainer">
        <div style={styles.innerContainer}>
          {React.Children.map(
            inputs,
            input =>
              input &&
              <div
                key={input.props.source}
                className={`aor-input-${member}.${input.props.source}`}
                style={input.props.style}
              >
                <EmbeddedArrayInputFormField input={input} {...passedProps} />
              </div>,
          )}
        </div>
      </div>
    );
  };

  renderList = ({ value }) => {
    const { children, style, translate, labelRemove, allowRemove, readOnly, disabled, source } = this.props;
    return (
      <div className="EmbeddedArrayInputContainer" style={style}>
        <div>
          {this.renderListItem({
            inputs: children,
            member: source,
            translate,
            labelRemove,
            allowRemove,
            readOnly,
            disabled,
          })}
        </div>
        <br />
      </div>
    );
  };

  render() {
    const { source, label, addLabel, translate, resource } = this.props;
    const labelStyle = Object.assign(styles.label, {
      color: this.context.muiTheme ? this.context.muiTheme.textField.focusColor : '',
    });

    const minimizedLabel =
      typeof label !== 'undefined'
        ? translate(label, { _: label })
        : translate(
          `resources.${resource}.fields.${source.replace(/\./g, '.fields.').replace(/\[\d+\]/g, '')}.name`,
          {
            _: inflection.humanize(source.split('.').pop()),
          },
        );

    const labelElement =
      !addLabel &&
      <Label style={labelStyle} text={minimizedLabel} muiTheme={this.context.muiTheme} />

    return (
      <div>
        {labelElement}
        <Field name={source} component={this.renderList} props={this.props} />
      </div>
    );
  }
}

export default translate(GrouppedInput);
