import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import { capitalize } from '../utils';

export const template = 'package/package.graphql.schema.ts.njs';

export function generate(te: Factory, pack: ModelPackage) {
  return te.run(mapper(pack), template);
}

export interface MapperOutupt {
  name: string;
  entities: { name: string }[];
}

import {
  getEntities,
} from '../queries';

export function mapper(pack: ModelPackage): MapperOutupt {
  return {
    name: capitalize(pack.name),
    entities: getEntities(pack)
      .map(e => ({
        name: e.name,
      })),
  };
}
