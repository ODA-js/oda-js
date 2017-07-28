import { Entity, ModelPackage } from 'oda-model';
import { mapToGraphqlTypes } from '../../utils';
import * as inflect from 'inflected';
import { Factory } from 'fte.js';

export const template = 'entity/viewer/entry.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl) {
  return te.run(mapper(entity, pack, role, allowAcl), template);
}

export interface MapperOutput {
  name: string;
  plural: string;
  pluralEntry: string;
  singularEntry: string;
  unique: string;
}

import {
  getFieldsForAcl,
  identityFields,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl): MapperOutput {
  let unique = [
    { name: 'id', type: 'ID' },
    ...getFieldsForAcl(allowAcl)(role)(entity)
      .filter(identityFields)]
    .map(f => ({
      name: f.name,
      type: (f.name !== 'id') ? mapToGraphqlTypes(f.type) : 'ID',
    }))
    .map(i => `${i.name}: ${i.type}`).join(', ');

  return {
    name: entity.name,
    plural: entity.plural,
    singularEntry: inflect.camelize(entity.name, false),
    pluralEntry: inflect.camelize(entity.plural, false),
    unique,
  };
}
