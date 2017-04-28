import { Entity, ModelPackage } from 'oda-model';
import * as inflect from 'inflected';

import { Factory } from 'fte.js';
import { mapToTSTypes } from '../../utils';

export const template = 'entity/viewer/resolver.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl) {
  return te.run(mapper(entity, pack, role, allowAcl), template);
}

export interface MapperOutupt {
  name: string;
  singular: string;
  plural: string;
  indexed: { name: string, type: string }[];
  unique: { name: string, type: string }[];
}

import {
  getFieldsForAcl,
  indexedFields,
  identityFields,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl): MapperOutupt {
  let fieldsAcl = getFieldsForAcl(allowAcl)(role)(entity);
  return {
    name: entity.name,
    singular: inflect.camelize(entity.name, false),
    plural: inflect.camelize(entity.plural, false),
    unique: [
      { name: 'id', type: 'string' },
      ...fieldsAcl
        .filter(identityFields)
        .map(f => ({
          name: f.name,
          type: mapToTSTypes(f.type),
        })),
    ],
    indexed: fieldsAcl
      .filter(indexedFields)
      .map(f => ({
        name: f.name,
        type: mapToTSTypes(f.type),
      })),
  };
}
