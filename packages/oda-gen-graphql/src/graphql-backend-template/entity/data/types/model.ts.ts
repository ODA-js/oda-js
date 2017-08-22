import { Entity, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'entity/data/types/model.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, typeMapper: { [key: string]: (string) => string }, defaultAdapter?: string) {
  return te.run(mapper(entity, pack, typeMapper), template);
}

export interface MapperOutupt {
  name: string;
  plural: string;
  description: string;
  fields: {
    name: string;
    type: string;
  }[];
}

import {
  getFields,
  persistentFields,
  singleStoredRelationsExistingIn,
  mutableFields,
  idField,
} from '../../../queries';

export function mapper(entity: Entity, pack: ModelPackage, typeMapper: { [key: string]: (string) => string }): MapperOutupt {
  const mapToTSTypes = typeMapper.typescript;
  const singleStoredRelations = singleStoredRelationsExistingIn(pack);
  let ids = getFields(entity).filter(idField);

  return {
    name: entity.name,
    plural: entity.plural,
    description: entity.description,
    fields: [
      ...ids,
      ...getFields(entity)
        .filter(f => singleStoredRelations(f) || mutableFields(f))]
      .map(f => {
        return {
          name: f.name,
          type: mapToTSTypes(f.type),
          required: f.required,
        };
      }),
  };
}
