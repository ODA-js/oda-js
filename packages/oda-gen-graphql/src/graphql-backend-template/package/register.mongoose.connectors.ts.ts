import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'package/register.mongoose.connectors.ts.njs';

export function generate(te: Factory, pack: ModelPackage) {
  return te.run(mapper(pack), template);
}

export interface MapperOutupt {
  entities: {
    name: string;
    adapter: string;
  }[];
}

import {
  getEntities,
} from '../queries';

export function mapper(pack: ModelPackage): MapperOutupt {
  return {
    entities: getEntities(pack)
      .map(e => ({
        name: e.name,
        adapter: e.getMetadata('storage.adapter', 'mongoose'),
      })),
  };
}
