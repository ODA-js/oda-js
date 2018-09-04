import { printRequired } from '../utils';
import { ModelPackage, FieldArgs } from 'oda-model';

export interface MutationInput {
  name: string;
  description: string;
  args: FieldArgs[];
  payload: FieldArgs[];
}

export interface MutationQueryOutput {
  name: string;
  args: {
    name: string;
    type: {
      ts: string;
      gql: string;
    };
  }[];
  payload: {
    name: string;
    type: {
      ts: string;
      gql: string;
    };
  }[];
}

export function mapper(
  mutation: MutationInput,
  pack: ModelPackage,
  typeMapper: { [key: string]: (i: string) => string },
): MutationQueryOutput {
  const mapToTSTypes = typeMapper.typescript;
  return {
    name: mutation.name,
    args: mutation.args.map(arg => ({
      name: arg.name,
      type: {
        ts: mapToTSTypes(arg.type),
        gql: `${typeMapper.graphql(arg.type)}${printRequired(arg)}`,
      },
    })),
    payload: mutation.payload.map(arg => ({
      name: arg.name,
      type: {
        ts: mapToTSTypes(arg.type),
        gql: `${typeMapper.graphql(arg.type)}${printRequired(arg)}`,
      },
    })),
  };
}
