import unbase64 from './unbase64';
import base64 from './base64';
import { GraphQLNonNull, GraphQLID, GraphQLFieldConfig, GraphQLScalarType } from 'graphql';

export interface ResolvedGlobalId {
  type: string;
  id: string;
};

export function fromGlobalId(globalId: string): ResolvedGlobalId {
  const unbasedGlobalId = unbase64(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1)
  };
}

export function toGlobalId(type: string, id: string): string {
  return base64([type, id].join(':'));
}

export function globalIdField(
  typeName?: string,
  idFetcher?: (object: any, context: any, info) => string
) {
  return {
    name: 'id',
    description: 'The ID of an object',
    type: new GraphQLNonNull(GraphQLID),
    resolve: (obj, args, context, info) => toGlobalId(
      typeName || info.parentType.name,
      idFetcher ? idFetcher(obj, context, info) : obj.id
    )
  };
}