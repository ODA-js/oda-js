import { Kind } from 'graphql/language';
import { GQLModule } from './empty';

export class IdType extends GQLModule {
  protected _resolver: { [key: string]: any } = {
    ID: {
      __serialize: String,
      __parseValue: String,
      __parseLiteral: parseLiteral,
    },
  };
  protected _typeDef = {
    type: [`
      scalar ID
    `],
  };
}

function parseLiteral(ast) {
  return ast.kind === Kind.STRING ? ast.value : null;
}
