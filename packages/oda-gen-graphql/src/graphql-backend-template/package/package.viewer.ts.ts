import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'package/package.viewer.ts.njs';

export function generate(te: Factory, pack: ModelPackage) {
  return te.run(mapper(pack), template);
}

export interface MapperOutupt {
  entities: { name: string }[];
}

import {
  getEntities,
} from '../queries';

export function mapper(pack: ModelPackage): MapperOutupt {
  return {
    entities: getEntities(pack)
      .map(e => ({
        name: e.name,
      })),
  };
}
