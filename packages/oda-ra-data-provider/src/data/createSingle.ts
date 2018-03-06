import { actionType } from './../constants';
import { queries } from './resource/consts';
import { INamedField, IResourceContainer } from './resource/interfaces';

export default function (data: object, field: INamedField, resources: IResourceContainer) {
  const fieldId = field.name + 'Id';
  const fieldType = field.name + 'Type';
  const fieldCreate = field.name + 'Create';
  const fieldUnlink = field.name + 'Unlink';
  let embedType = data[fieldType] ? data[fieldType] : actionType.USE;

  switch (embedType) {
    case actionType.USE:
      if (data[fieldId]) {
        return {
          [field.name]: { id: data[fieldId] },
        };
      }
    case actionType.CLONE:
    case actionType.CREATE:
      if (data[field.name] && typeof data[field.name] === 'object') {
        let res = resources
          .queries(field.ref.resource, queries.CREATE)
          .variables({ data: data[field.name] }).input;
        delete res.id;
        return {
          [field.name]: {
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