
import { GraphQLNonNull, GraphQLID, GraphQLFieldConfig, GraphQLScalarType } from 'graphql';
import { toGlobalId } from 'oda-isomorfic';

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