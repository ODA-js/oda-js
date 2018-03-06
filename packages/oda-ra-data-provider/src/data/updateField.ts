import * as comparator from 'comparator.js';

export default function (data: object, previousData: object = {}, field: string) {
  if (!comparator.looseEq(data[field], previousData[field])) {
    return {
      [field]: !comparator.looseEq(data[field]) ? data[field] : null,
    };
  }
}
