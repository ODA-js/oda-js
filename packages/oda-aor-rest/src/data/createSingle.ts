import * as comparator from 'comparator.js';
import { actionType } from './../ui/consts';

export default function (data, field, resource, resources) {
  const fieldId = field + 'Id';
  const fieldType = field + 'Type';
  const fieldCreate = field + 'Create';
  const fieldUnlink = field + 'Unlink';
  switch (data[fieldType]) {
    case actionType.USE:
      if (data[fieldId]) {
        return {
          [field]: { id: data[fieldId] },
        };
      }
    case actionType.CLONE:
    case actionType.CREATE:
      if (data[field] && typeof data[field] === 'object') {
        let res = resources[resource].CREATE.variables({ data: data[field] }).input;
        delete res.id;
        return {
          [field]: {
            ...res,
          },
        };
      }
  }
}

/* export default function (data, field, resource, resources) {
  if (!comparator.strictEq(data[field])) {
    let res = resources[resource].CREATE.variables({ data: data[field] }).input;
    if (!comparator.looseEq({}, {
      ...res,
    })) {
      return {
        [field]: res,
      };
    }
  }
}
 */