import * as comparator from 'comparator.js';
import { actionType } from './../ui/consts';

export default function (data, previousData, field, resource, resources) {
  const fieldId = field + 'Id';
  const fieldType = field + 'Type';
  const fieldCreate = field + 'Create';
  const fieldUnlink = field + 'Unlink';
  switch (data[fieldType]) {
    case actionType.USE:
      if (data[fieldId] || (previousData[field] && previousData[field].id)) {
        return {
          [field]: { id: data[fieldId] },
        };
      }
    case actionType.UPDATE:
      if (data[field] && typeof data[field] === 'object') {
        let res = resources[resource].UPDATE.variables({ data: data[field], previousData: previousData[field] || {} }).input;
        return {
          [field]: {
            id: previousData[fieldId] || previousData[field].id,
            ...res,
          },
        };
      };
    case actionType.CLONE:
    case actionType.CREATE:
      if (data[field] && typeof data[field] === 'object') {
        let res = resources[resource].CREATE.variables({ data: data[field] }).input;
        delete res.id;
        if (previousData[fieldId] || (previousData[field] && previousData[field].id)) {
          return {
            [fieldUnlink]: {
              id: previousData[fieldId] || previousData[field].id,
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

    case actionType.UNLINK:
      if (previousData[fieldId] || (previousData[field] && previousData[field].id)) {
        return {
          [fieldUnlink]: {
            id: previousData[fieldId] || previousData[field].id,
          },
        };
      }
  }
}
