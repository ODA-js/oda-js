import { Entity, ModelPackage } from 'oda-model';
import * as inflect from 'inflected';

import { Factory } from 'fte.js';

export const template = 'entity/viewer/resolver.ts.njs';

export function generate(
  te: Factory,
  entity: Entity,
  pack: ModelPackage,
  role: string,
  allowAcl,
  typeMapper: { [key: string]: (string) => string },
) {
  return te.run(mapper(entity, pack, role, allowAcl, typeMapper), template);
}

export interface MapperOutupt {
  name: string;
  singular: string;
  plural: string;
  indexed: { name: string; type: string }[];
  unique: { name: string; type: string }[];
}

import {
  getFieldsForAcl,
  indexedFields,
  identityFields,
  idField,
  getFields,
} from '../../queries';

export function mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
): MapperOutupt {
  let fieldsAcl = getFieldsForAcl(aclAllow, role, pack)(entity);
  let ids = getFields(entity).filter(idField);
  const mapToTSTypes = typeMapper.typescript;

  return {
    name: entity.name,
    singular: inflect.camelize(entity.name, false),
    plural: inflect.camelize(entity.plural, false),
    unique: [...ids, ...fieldsAcl.filter(identityFields)].map(f => ({
      name: f.name,
      type: mapToTSTypes(f.type),
    })),
    indexed: fieldsAcl.filter(indexedFields).map(f => ({
      name: f.name,
      type: mapToTSTypes(f.type),
    })),
  };
}
