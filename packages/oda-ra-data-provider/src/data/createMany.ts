import { IResourceContainer, INamedField } from "./resource/interfaces";
import { queries } from "./resource/resourceContainer";

export default function (data: object, field: INamedField, resources: IResourceContainer) {
  const fieldIds = field.name + 'Ids';
  const fieldValues = field.name + 'Values';
  if (data[fieldIds] !== undefined && Array.isArray(data[fieldIds]) && data[fieldIds].length > 0) {
    return {
      [field.name]: data[fieldIds].map(f => ({ id: f })),
    };
  } else {
    if (data[fieldValues] !== undefined && Array.isArray(data[fieldValues]) && data[fieldValues].length > 0) {
      return {
        [field.name]: data[fieldValues]
          .map(value => resources
            .queries(field.ref.resource, queries.CREATE)
            .variables({ data: value }).input),
      };
    }
  }
}
