import { Entity, ModelPackage } from 'oda-model';
import * as inflect from 'inflected';

import { Factory } from 'fte.js';
import { capitalize, mapToTSTypes } from '../../utils';

export const template = 'entity/query/resolver.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow) {
  return te.run(mapper(entity, pack, role, aclAllow), template);
}

export interface MapperOutupt {
  name: string;
  singular: string;
  plural: string;
  indexed: {
    args: { name: string, type: string }[];
  };
  unique: {
    args: { name: string, type: string }[];
    find: { name: string, type: string, cName: string }[];
    complex: { name: string, fields: { name: string, uName: string, type: string }[] }[];
  };
}

import {
  getFieldsForAcl,
  indexedFields,
  identityFields,
  complexUniqueIndex,
  oneUniqueInIndex,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow): MapperOutupt {
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  return {
    name: entity.name,
    singular: inflect.camelize(entity.name, false),
    plural: inflect.camelize(entity.plural, false),
    unique: {
      args: [
        { name: 'id', type: 'string' },
        ...fieldsAcl
          .filter(identityFields)
          .filter(oneUniqueInIndex(entity))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
          })),
      ],
      find: [
        ...fieldsAcl
          .filter(identityFields)
          .filter(oneUniqueInIndex(entity))
          .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
            cName: capitalize(f.name),
          })),
      ],
      complex: complexUniqueIndex(entity).map(i => {
        let fields = Object.keys(i.fields)
          .map(fn => entity.fields.get(fn))
          .map(f => ({
            name: f.name,
            uName: capitalize(f.name),
            type: mapToTSTypes(f.type),
          }));
        return {
          name: i.name,
          fields,
        };
      }),
    },
    indexed: {
      args: fieldsAcl
        .filter(indexedFields)
        .map(f => ({
          name: f.name,
          type: mapToTSTypes(f.type),
        })),
    },
  };
}
