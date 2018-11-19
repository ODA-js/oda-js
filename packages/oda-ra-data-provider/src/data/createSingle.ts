import { actionType } from './../constants';
import { INamedField, IResourceContainer } from './resource/interfaces';
import isPlainObject from 'lodash/isPlainObject';

export default function(
  data: {
    [key: string]: any;
  },
  field: INamedField,
  resources: IResourceContainer,
) {
  const name = field.name;
  const value = data[name];
  if (value !== undefined) {
    if (!isPlainObject(value)) {
      return {
        [name]: { id: value },
      };
    } else {
      return {
        [name]: resources
          .queries(field.ref.resource, 'CREATE')
          .variables({ data: data[field.name] }).input,
      };
    }
  }
}
