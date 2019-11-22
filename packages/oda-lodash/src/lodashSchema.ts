import { types, Scalar, Input, Directive, Enum, Schema } from 'oda-gen-common';
import gql from 'graphql-tag';
import { ValueNode } from 'graphql';
import lodashProps from './lodashProps';

export const Path = new Scalar({
  schema: gql`
    scalar Path
  `,
  resolver: {
    serialize: String,
    parseValue: String,
    parseLiteral: (x: ValueNode) => {
      if (x.kind === 'StringValue') return x.value;
    },
  },
});

export const RegularExpression = new Input({
  schema: gql`
    input RegExpr {
      match: String!
      flags: String
    }
  `,
});

export const Predicate = new Input({
  schema: gql`
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
});

export const Directives = new Directive({
  schema: gql`
    directive @_(
      ${lodashProps}
    ) on FIELD | QUERY
  `,
});

export const LodashOperations = new Input({
  schema: gql`
    input LodashOperations {
      ${lodashProps}
    }
  `,
});

export const DummyArgument = new Enum({
  schema: gql`
    enum DummyArgument {
      none
    }
  `,
});

export const ConvertTypeArgument = new Enum({
  schema: gql`
    enum ConvertTypeArgument {
      toNumber
      toString
    }
  `,
});

export default new Schema({
  name: 'LodashSchema',
  items: [
    Path,
    RegularExpression,
    Predicate,
    Directives,
    LodashOperations,
    DummyArgument,
    ConvertTypeArgument,
  ],
});
