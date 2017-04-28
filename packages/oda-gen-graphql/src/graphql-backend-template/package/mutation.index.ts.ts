import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import { decapitalize, capitalize } from '../utils';

export const template = 'package/mutation.index.ts.njs';

export function generate(te: Factory, pack: ModelPackage) {
  return te.run(mapper(pack), template);
}

export interface MapperOutupt {
  name: string;
  mutations: {
    name: string;
    entry: string;
  }[];
}

import {
  getMutations,
} from '../queries';

export function mapper(pack: ModelPackage): MapperOutupt {
  return {
    name: capitalize(pack.name),
    mutations: getMutations(pack)
      .map(e => ({
        name: e.name,
        entry: capitalize(e.name),
      })),
  };
}
