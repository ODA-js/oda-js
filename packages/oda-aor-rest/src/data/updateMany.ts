import * as comparator from 'comparator.js';

export default function (data, previousData, field) {
  const fieldIds = field + 'Ids';
  if (!comparator.strictEq(previousData[fieldIds], data[fieldIds])) {
    const diff = comparator.diff(previousData[fieldIds], data[fieldIds]);
    if (diff.inserted) {
      return {
        [field]: Object.keys(diff.inserted)
          .map(f => ({ id: diff.inserted[f].value })),
      }
    }
    if (diff.removed) {
      return {
        [field + 'Unlink']: Object.keys(diff.removed)
          .map(f => ({ id: diff.removed[f].value })),
      }
    }
  }
}
