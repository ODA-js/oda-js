import { difference } from 'lodash';
import { differenceBy } from 'lodash';
import { isEqual } from 'lodash';
import { isPlainObject } from 'lodash';

import { INamedField, IResourceContainer } from './resource/interfaces';

function sameId(a: { id: any }, b: { id: any }) {
  return a.id === b.id;
}

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
    } else if (!value.some(f => isPlainObject(f))) {
      const removed = difference(previousData[name], data[name]).map(f => ({
        id: f,
      }));
      const inserted = difference(data[name], previousData[name]).map(f => ({
        id: f,
      }));
      return {
        [`${name}`]: inserted,
        [`${name}Unlink`]: removed,
      };
    } else {
      const removed = differenceBy(previousData[name], data[name], 'id').map(
        f => ({
          id: f,
        }),
      );
      const newItems = differenceBy(data[name], previousData[name], 'id');
      const created = newItems.filter(f => !f.hasOwnProperty('id'));
      const inserted = newItems.filter(f => f.hasOwnProperty('id'));
      return {
        [`${name}`]: inserted,
        [`${name}Unlink`]: removed,
        [`${name}Create`]: created,
      };
    }
  }
}
