import { ModelPackage } from 'oda-model';
import { Factory } from 'fte.js';

export const template = 'mutation/entry.graphql.njs';

export interface MutationInput {
  name: string;
}

export function generate(te: Factory, mutation: MutationInput, pack: ModelPackage) {
  return te.run(mapper(mutation, pack), template);
}

export interface MapperOutput {
  name: string;
}

export function mapper(mutation: MutationInput, pack?: ModelPackage): MapperOutput {
  return {
    name: mutation.name,
  };
}
