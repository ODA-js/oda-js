import { MetaModel } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'model/packages.registerConnectors.ts.njs';

export function generate(te: Factory, pack: MetaModel, typeMapper: { [key: string]: (string) => string }) {
  return te.run(mapper(pack, typeMapper), template);
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

export function mapper(model: MetaModel, typeMapper: { [key: string]: (string) => string }): MapperOutupt {
  return {
    packageList: getPackages(model)
      .filter(p => !p.abstract)
      .map(e => ({
        name: e.name,
        entry: 'entry' + e.name,
      })),
  };
}
