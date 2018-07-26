import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { capitalize, decapitalize } from '../utils';

import {
  getFieldsForAcl,
  persistentFields,
  identityFields,
  oneUniqueInIndex,
  complexUniqueIndex,
  relations,
} from '../queries';

export function mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
) {
  let fieldsEntityAcl = getFieldsForAcl(aclAllow, role, pack)(entity);
  return {
    name: entity.name,
    findQuery: decapitalize(entity.name),
    ownerFieldName: decapitalize(entity.name),
    fields: fieldsEntityAcl
      // not only persistent fields but also not derived relations
      .filter(f => persistentFields(f) || (relations(f) && !f.derived))
      .map(f => ({
        name: f.name,
        type: typeMapper.typescript(f.type),
      })),
    unique: {
      find: [
        ...fieldsEntityAcl
          .filter(identityFields)
          .filter(oneUniqueInIndex(entity))
          .map(f => ({
            name: f.name,
            type: typeMapper.graphql(f.type),
            cName: capitalize(f.name),
          })),
      ],
      complex: complexUniqueIndex(entity).map(i => {
        let fields = Object.keys(i.fields)
          .map(fn => entity.fields.get(fn))
          .map(f => ({
            name: f.name,
            uName: capitalize(f.name),
            type: typeMapper.graphql(f.type),
          }))
          .sort((a, b) => {
            if (a.name > b.name) return 1;
            else if (a.name < b.name) return -1;
            else return 0;
          });
        return {
          name: i.name,
          fields,
        };
      }),
    },
  };
}
