import * as comparator from 'comparator.js';

export default function (data, previousData, field, resource, resources) {
  const fieldId = field + 'Id';
  const fieldType = field + 'Type';
  if (!comparator.strictEq(previousData[fieldId], data[fieldId])) {
    return {
      [field]: { id: data[fieldId] },
    };
  } else if (!comparator.strictEq(previousData[field], data[field])) {
    const fieldCreate = field + 'Create';
    const fieldUnlink = field + 'Unlink';
    if (previousData && previousData[field] && data[field].id !== previousData[field].id) {
      let res = resources[resource].UPDATE.variables({ data: data[field], previousData: previousData[field] || {} }).input;
      let result = {};
      if (!comparator.looseEq({}, res)) {
        result = {
          ...result,
          [fieldCreate]: res
        };
      }
      return {
        ...result,
        [fieldUnlink]: {
          id: previousData[field].id
        },
      };
    } else {
      let res = resources[resource].UPDATE.variables({ data: data[field], previousData: previousData[field] || {} }).input;
      if (!comparator.looseEq({}, {
        id: data[field],
        ...res,
      })) {
        return {
          [fieldCreate]: res,
        };
      } else if (Object.keys(res).length > 1) {
        return {
          [field]: res,
        };
      }
    }
  }
}
