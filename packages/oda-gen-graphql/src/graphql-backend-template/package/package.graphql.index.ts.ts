import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import { capitalize } from '../utils';

export const template = 'package/package.graphql.index.ts.njs';

export function generate(te: Factory, pack: ModelPackage, typeMapper: { [key: string]: (string) => string }) {
  return te.run(mapper(pack, typeMapper), template);
}

export interface MapperOutupt {
  name: string;
  entities: { name: string }[];
}

import {
  getEntities,
} from '../queries';

export function mapper(pack: ModelPackage, typeMapper: { [key: string]: (string) => string }): MapperOutupt {
  return {
    name: capitalize(pack.name),
    entities: getEntities(pack)
      .map(e => ({
        name: e.name,
      })),
  };
}
