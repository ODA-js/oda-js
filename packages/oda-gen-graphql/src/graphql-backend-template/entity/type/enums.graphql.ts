import { Entity, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'entity/type/enums.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl, typeMapper: { [key: string]: (string) => string }) {
  return te.run(mapper(entity, pack, role, allowAcl, typeMapper), template);
}

export interface MapperOutput {
  name: string;
  fields: string[];
}

import {
  getOrderBy,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl, typeMapper: { [key: string]: (string) => string }): MapperOutput {
  return {
    name: entity.name,
    fields: getOrderBy(allowAcl, role, entity),
  };
}
