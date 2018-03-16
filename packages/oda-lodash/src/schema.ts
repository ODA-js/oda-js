// tslint:disable:no-unused-variable
import { types, lib } from 'oda-gen-common';
const { deepMerge } = lib;
import { makeExecutableSchema } from 'graphql-tools';
import { LodashModule } from './lodash';

class LodashSchema extends types.GQLModule {
  protected _name = 'LodashSchema';
  protected _composite: types.GQLModule[] = [
    new types.DefaultTypes({}),
    new LodashModule({}),
  ];

  public get typeDefs() {
    return `
      ${this.typeDef.join('\n  ')}

      type RootQuery {
        dummy: String
      }

      schema {
        query: RootQuery
      }
      `;
  }

  public build() {
    super.build();
    this._resolver = deepMerge(
      this.resolver,
      {
        RootQuery: this.query,
      },
    );
  }

  public get resolvers() {
    return this.applyHooks(this.resolver);
  }
}

let _lodashAST;

export function lodashAST() {
  if (!_lodashAST) {
    let current = new LodashSchema({});
    current.build();
    let schema = makeExecutableSchema({
      typeDefs: current.typeDefs.toString(),
      resolvers: current.resolvers,
      resolverValidationOptions: {
        requireResolversForNonScalar: false,
      },
    });
    _lodashAST = schema.getDirective('_');
  }
  return _lodashAST;
}
