import { types } from 'oda-gen-common';

import lodashProps from './lodashProps';

export class Path extends types.GQLModule {
  protected _name = 'Path';
  protected _resolver: { [key: string]: any } = {
    Path: {
      __serialize: String,
      __parseValue: String,
      __parseLiteral: x => x.value,
    },
  };
  protected _typeDef = {
    type: [
      `
      scalar Path
    `,
    ],
  };
}

export class RegularExpression extends types.GQLModule {
  protected _name = 'RegularExpression';

  protected _typeDef = {
    type: [
      `
        input RegExpr {
          match: String!
          flags: String
        }
    `,
    ],
  };
}

export class Predicate extends types.GQLModule {
  protected _name = 'Predicate';
  protected _typeDef = {
    type: [
      `
        input Predicate {
          lt: JSON
          lte: JSON
          gt: JSON
          gte: JSON
          eq: JSON
          startsWith: String
          endsWith: String
          and: [Predicate!]
          or: [Predicate!]
        ${lodashProps}
        }
    `,
    ],
  };
}

export class DirectiveLodash extends types.GQLModule {
  protected _name = 'DirectiveLodash';
  protected _typeDef = {
    type: [
      `
      directive @_(
        ${lodashProps}
      ) on FIELD | QUERY
    `,
    ],
  };
}

export class LodashOperations extends types.GQLModule {
  protected _name = 'LodashOperations';
  protected _typeDef = {
    type: [
      `
        input LodashOperations {
          ${lodashProps}
        }
    `,
    ],
  };
}

export class DummyArgument extends types.GQLModule {
  protected _name = 'DummyArgument';
  protected _typeDef = {
    type: [
      `
      enum DummyArgument{
        none
      }
    `,
    ],
  };
}

export class ConvertTypeArgument extends types.GQLModule {
  protected _name = 'ConvertTypeArgument';
  protected _typeDef = {
    type: [
      `
      enum ConvertTypeArgument{
        toNumber
        toString
      }
    `,
    ],
  };
}

export class LodashModule extends types.GQLModule {
  protected _name = 'LodashModule';
  protected _composite = [
    new RegularExpression({}),
    new Path({}),
    new Predicate({}),
    new DirectiveLodash({}),
    new LodashOperations({}),
    new DummyArgument({}),
    new ConvertTypeArgument({}),
  ];
}
