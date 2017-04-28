import { Factory } from 'fte.js';
import { mapToGraphqlTypes, printRequired } from '../utils';
import { ModelPackage } from 'oda-model';

export const template = 'mutation/types.graphql.njs';

export function generate(te: Factory, mutation: MutationInput, pack: ModelPackage) {
  return te.run(mapper(mutation, pack), template);
}

export interface MutationInput {
  name: string;
  description: string;
  args: {
    name: string;
    type: string;
    required: boolean;
  }[];
  payload: {
    name: string;
    type: string;
    required: boolean;
  }[];
}

export interface MapperOutput {
  name: string;
  args: {
    name: string,
    type: string,
  }[];
  payload: {
    name: string,
    type: string,
  }[];
}

export function mapper(mutation: MutationInput, pack: ModelPackage): MapperOutput {
  return {
    name: mutation.name,
    args: mutation.args.map(arg => ({
      name: arg.name,
      type: `${mapToGraphqlTypes(arg.type)}${printRequired(arg)}`,
    })),
    payload: mutation.payload.map(arg => ({
      name: arg.name,
      type: `${mapToGraphqlTypes(arg.type)}${printRequired(arg)}`,
    })),
  };
}
