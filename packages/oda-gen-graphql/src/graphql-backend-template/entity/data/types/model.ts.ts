import { Entity, ModelPackage } from 'oda-model';
import { mapToTSTypes } from '../../../utils';
import { Factory } from 'fte.js';

export const template = 'entity/data/types/model.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage) {
  return te.run(mapper(entity, pack), template);
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
} from '../../../queries';

export function mapper(entity: Entity, pack: ModelPackage): MapperOutupt {
  return {
    name: entity.name,
    plural: entity.plural,
    description: entity.description,
    fields: getFields(entity)
      .filter(f => persistentFields(f))
      .map(f => {
        return {
          name: f.name,
          type: mapToTSTypes(f.type),
          required: f.required,
        };
      }),
  };
}
