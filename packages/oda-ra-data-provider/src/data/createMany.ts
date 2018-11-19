import { IResourceContainer, INamedField } from './resource/interfaces';
import isPlainObject from 'lodash/isPlainObject';

export default function(
  data: {
    [key: string]: any;
  },
  field: INamedField,
  resources: IResourceContainer,
) {
  const value = data[field.name];
  if (value !== undefined && Array.isArray(value) && value.length > 0) {
    if (!value.some(f => isPlainObject(f))) {
      return {
        [field.name]: data[field.name].map((f: string | number) => ({ id: f })),
      };
    } else {
      return {
        [field.name]: data[field.name].map(
          (value: any) =>
            resources
              .queries(field.ref.resource, 'CREATE')
              .variables({ data: value }).input,
        ),
      };
    }
  }
}
