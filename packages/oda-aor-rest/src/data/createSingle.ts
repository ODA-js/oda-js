import * as comparator from 'comparator.js';

export default function (data, field, resource, resources) {
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
