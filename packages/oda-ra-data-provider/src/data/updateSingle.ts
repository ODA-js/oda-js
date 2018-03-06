import * as comparator from 'comparator.js';

import { actionType } from './../constants';
import { queries } from './resource/consts';
import { INamedField, IResourceContainer } from './resource/interfaces';

export default function (data: object, previousData: object, field: INamedField, resources: IResourceContainer) {
  const fieldId = field.name + 'Id';
  const fieldType = field.name + 'Type';
  const fieldCreate = field.name + 'Create';
  const fieldUnlink = field.name + 'Unlink';
  let embedType = data[fieldType] ? data[fieldType] : actionType.USE;

  switch (embedType) {
    case actionType.USE:
      if (!comparator.looseEq(data[fieldId], (previousData[fieldId] || (previousData[field.name] && previousData[field.name].id)))) {
        return {
          [field.name]: { id: data[fieldId] },
        };
      }
      break;
    case actionType.UPDATE:
      if (data[field.name] && typeof data[field.name] === 'object') {
        let res = resources.queries(field.ref.resource, queries.UPDATE)
          .variables({ data: data[field.name], previousData: previousData[field.name] || {} }).input;
        return {
          [field.name]: {
            id: previousData[fieldId] || previousData[field.name].id,
            ...res,
          },
        };
      };
      break;
    case actionType.CLONE:
    case actionType.CREATE:
      if (data[field.name] && typeof data[field.name] === 'object') {
        let res = resources.queries(field.ref.resource, queries.CREATE)
          .variables({ data: data[field.name] }).input;
        delete res.id;
        if (previousData[fieldId] || (previousData[field.name] && previousData[field.name].id)) {
          return {
            [fieldUnlink]: {
              id: previousData[fieldId] || previousData[field.name].id,
            },
            [fieldCreate]: {
              ...res,
            },
          };
        } else {
          return {
            [fieldCreate]: {
              ...res,
            },
          };
        }
      }
      break;
    case actionType.UNLINK:
      if (previousData[fieldId] || (previousData[field.name] && previousData[field.name].id)) {
        return {
          [fieldUnlink]: {
            id: previousData[fieldId] || previousData[field.name].id,
          },
        };
      }
      break;
  }
}
