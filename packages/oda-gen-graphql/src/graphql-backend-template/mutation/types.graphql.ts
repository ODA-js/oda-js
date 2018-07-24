import { Factory } from 'fte.js';
import { printRequired } from '../utils';
import { ModelPackage, FieldArgs } from 'oda-model';

export const template = 'mutation/types.graphql.njs';

export function generate(
  te: Factory,
  mutation: MutationInput,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
) {
  return te.run(mapper(mutation, pack, typeMapper), template);
}

export interface MutationInput {
  name: string;
  description: string;
  args: FieldArgs[];
  payload: FieldArgs[];
}

export interface MapperOutput {
  name: string;
  args: {
    name: string;
    type: string;
  }[];
  payload: {
    name: string;
    type: string;
  }[];
}

export function mapper(
  mutation: MutationInput,
  pack: ModelPackage,
  typeMapper: { [key: string]: (string) => string },
): MapperOutput {
  return {
    name: mutation.name,
    args: mutation.args.map(arg => ({
      name: arg.name,
      type: `${typeMapper.graphql(arg.type)}${printRequired(arg)}`,
    })),
    payload: mutation.payload.map(arg => ({
      name: arg.name,
      type: `${typeMapper.graphql(arg.type)}${printRequired(arg)}`,
    })),
  };
}
