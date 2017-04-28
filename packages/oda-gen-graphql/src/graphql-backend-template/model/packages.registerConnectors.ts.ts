import { MetaModel } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'model/packages.registerConnectors.ts.njs';

export function generate(te: Factory, pack: MetaModel) {
  return te.run(mapper(pack), template);
}

export interface MapperOutupt {
  packageList: {
    name: string;
    entry: string;
  }[];
}

import {
  getPackages,
} from '../queries';

export function mapper(model: MetaModel): MapperOutupt {
  return {
    packageList: getPackages(model)
      .filter(p => !p.abstract)
      .map(e => ({
        name: e.name,
        entry: 'entry' + e.name,
      })),
  };
}
