import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'package/index.mongoose.connectors.ts.njs';

export function generate(te: Factory, pack: ModelPackage, typeMapper: { [key: string]: (string) => string }) {
  return te.run(mapper(pack, typeMapper), template);
}

export interface MapperOutupt {
  entities: { name: string }[];
}

import {
  getEntities,
} from '../queries';

export function mapper(pack: ModelPackage, typeMapper: { [key: string]: (string) => string }): MapperOutupt {
  return {
    entities: getEntities(pack)
      .map(e => ({
        name: e.name,
      })),
  };
}
