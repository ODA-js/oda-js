import * as comparator from 'comparator.js';
import * as differenceWith from 'lodash/differenceWith';
import * as intersectionWith from 'lodash/intersectionWith';
import * as isEqual from 'lodash/isEqual';

import { actionType } from './../constants';
import { queries } from './resource/consts';
import { INamedField, IResourceContainer } from './resource/interfaces';

function sameId(a, b) {
  return a.id === b.id;
}

export default function (data: object, previousData: object, field: INamedField, resources: IResourceContainer) {
  const fieldIds = field.name + 'Ids';
  const fieldValues = field.name + 'Values';
  const fieldUnlink = field.name + 'Unlink';
  const fieldCreate = field.name + 'Create';
  const fieldType = field.name + 'Type';
  if (!comparator.strictEq(previousData[fieldIds], data[fieldIds])) {
    const diff = comparator.diff(previousData[fieldIds], data[fieldIds]);
    if (diff.inserted) {
      return {
        [field.name]: Object.keys(diff.inserted)
          .map(f => ({ id: diff.inserted[f].value })),
      };
    }
    if (diff.removed) {
      return {
        [fieldUnlink]: Object.keys(diff.removed)
          .map(f => ({ id: diff.removed[f].value })),
      };
    }
  } else if (!comparator.strictEq(previousData[fieldValues], data[fieldValues])) {
    let result = {};
    const removed = differenceWith(previousData[fieldValues], data[fieldValues], sameId).map(f => ({ id: f.id }));
    const inserted = differenceWith(data[fieldValues], previousData[fieldValues], sameId);
    const insertedExisting = inserted.filter(f => f.id && f[fieldType] === actionType.USE).map(f => ({ id: f.id }));
    const insertedNew = inserted.filter(f =>
      !f.id
      || f[fieldType] === actionType.CLONE
      || f[fieldType] === actionType.CREATE,
    ).map(item =>
      resources.queries(field.ref.resource, queries.CREATE)
        .variables({ data: item }).input);

    const changed = intersectionWith(data[fieldValues], previousData[fieldValues], sameId)
      .filter(f => (f[fieldType] !== actionType.CLONE && f[fieldType] !== actionType.CREATE))
      .filter(f => {
        const value = (previousData[fieldValues] as { id: string }[]).find(p => p.id === f.id);
        return !isEqual(
          resources.queries(field.ref.resource, queries.CREATE)
            .variables({ data: value }).input,
          resources.queries(field.ref.resource, queries.CREATE)
            .variables({ data: f }).input);
      })
      .map(f => {
        const value = (previousData[fieldValues] as { id: string }[]).find(p => p.id === f.id);
        return resources.queries(field.ref.resource, queries.UPDATE)
          .variables({ data: f, previousData: value }).input;
      });

    if (removed.length > 0) {
      result[fieldUnlink] = removed;
    }

    if (removed.length > 0) {
      result[fieldUnlink] = removed;
    }

    if (insertedNew.length > 0) {
      result[fieldCreate] = insertedNew;
    }

    if (insertedExisting.length > 0) {
      changed.push(...insertedExisting);
    }

    if (changed.length > 0) {
      result[field.name] = changed;
    }

    return result;
  }
}
