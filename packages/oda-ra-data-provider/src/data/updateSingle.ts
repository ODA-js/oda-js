import { INamedField, IResourceContainer } from './resource/interfaces';
import isPlainObject from 'lodash/isPlainObject';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';

export default function(
  data: object,
  previousData: object,
  field: INamedField,
  resources: IResourceContainer,
) {
  const name = field.name;
  const embedded = field.ref && field.ref.embedded;
  const value = data[name];
  const prev = previousData[name];
  if (!isEqual(value, prev)) {
    if (embedded) {
      return { [`${name}`]: data[name] };
    } else if (!isPlainObject(value)) {
      return {
        [name]: { id: value },
      };
    } else {
      if (data.hasOwnProperty('id') && !isNil(data['id'])) {
        return {
          [name]: resources.queries(field.ref.resource, 'UPDATE').variables({
            data: data[name],
            previousData: previousData[name] || {},
          }).input,
          [`${name}Unlink`]: {
            id: prev ? prev[name] : undefined,
          },
        };
      } else {
        return {
          [`${name}Create`]: resources
            .queries(field.ref.resource, 'CREATE')
            .variables({
              data: data[name],
            }).input,
        };
      }
    }
  }
}
