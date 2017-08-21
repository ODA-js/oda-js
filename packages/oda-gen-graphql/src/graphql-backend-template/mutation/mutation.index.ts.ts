import { Mutation, ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';
import * as schema from './index';
import { capitalize } from '../utils';

export const template = 'mutation/mutation.index.ts.njs';

export function generate(te: Factory, mutation: Mutation, pack: ModelPackage, role: string, aclAllow, typeMapper: { [key: string]: (string) => string }) {
  return te.run(mapper(mutation, pack, typeMapper), template);
}

export interface MapperOutupt {
  name: string;
  partials: {
    'entry': schema.entry.MapperOutput;
    'types': schema.types.MapperOutput;
  };
}

export function mapper(mutation: Mutation, pack: ModelPackage, typeMapper: { [key: string]: (string) => string }): MapperOutupt {
  return {
    name: capitalize(mutation.name),
    partials: {
      'entry': schema.entry.mapper(mutation, pack, typeMapper),
      'types': schema.types.mapper(mutation, pack, typeMapper),
    },
  };
}
