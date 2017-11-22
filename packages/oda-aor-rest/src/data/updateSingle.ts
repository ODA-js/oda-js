import * as comparator from 'comparator.js';
import { actionType } from './../ui/consts';
import { queries } from './resource/consts';
import { IResourceContainer, INamedField } from './resource/interfaces';

export default function (data: object, previousData: object, field: INamedField, resources: IResourceContainer) {
  const fieldId = field.name + 'Id';
  const fieldType = field.name + 'Type';
  const fieldCreate = field.name + 'Create';
  const fieldUnlink = field.name + 'Unlink';
  let embedType = data[fieldType] ? data[fieldType] : actionType.USE;
  // tslint:disable-next-line:switch-default
  switch (embedType) {
    case actionType.USE:
      if (data[fieldId] || (previousData[field.name] && previousData[field.name].id)) {
        return {
          [field.name]: { id: data[fieldId] },
        };
      }
    // tslint:disable-next-line:no-switch-case-fall-through
    case actionType.UPDATE:
      if (data[field.name] && typeof data[field.name] === 'object') {
        let res = resources.queries(field.ref, queries.UPDATE)
          .variables({ data: data[field.name], previousData: previousData[field.name] || {} }).input;
        return {
          [field.name]: {
            id: previousData[fieldId] || previousData[field.name].id,
            ...res,
          },
        };
      };
    // tslint:disable-next-line:no-switch-case-fall-through
    case actionType.CLONE:
    case actionType.CREATE:
      if (data[field.name] && typeof data[field.name] === 'object') {
        let res = resources.queries(field.ref, queries.CREATE)
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

    // tslint:disable-next-line:no-switch-case-fall-through
    case actionType.UNLINK:
      if (previousData[fieldId] || (previousData[field.name] && previousData[field.name].id)) {
        return {
          [fieldUnlink]: {
            id: previousData[fieldId] || previousData[field.name].id,
          },
        };
      }
  }
}
