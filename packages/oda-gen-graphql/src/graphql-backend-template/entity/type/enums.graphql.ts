import { Entity, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'entity/type/enums.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl) {
  return te.run(mapper(entity, pack, role, allowAcl), template);
}

export interface MapperOutput {
  name: string;
  fields: string[];
}

import {
  searchParamsForAcl,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl): MapperOutput {
  return {
    name: entity.name,
    fields: searchParamsForAcl(allowAcl)(role)(entity),
  };
}
