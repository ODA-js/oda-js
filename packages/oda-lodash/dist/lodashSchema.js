"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_gen_common_1 = require("oda-gen-common");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const lodashProps_1 = __importDefault(require("./lodashProps"));
exports.Path = new oda_gen_common_1.Scalar({
    schema: graphql_tag_1.default `
    scalar Path
  `,
    resolver: {
        serialize: String,
        parseValue: String,
        parseLiteral: (x) => {
            if (x.kind === 'StringValue')
                return x.value;
        },
    },
});
exports.RegularExpression = new oda_gen_common_1.Input({
    schema: graphql_tag_1.default `
    input RegExpr {
      match: String!
      flags: String
    }
  `,
});
exports.Predicate = new oda_gen_common_1.Input({
    schema: graphql_tag_1.default `
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
      ${lodashProps_1.default}
    }
  `,
});
exports.Directives = new oda_gen_common_1.Directive({
    schema: graphql_tag_1.default `
    directive @_(
      ${lodashProps_1.default}
    ) on FIELD | QUERY
  `,
});
exports.LodashOperations = new oda_gen_common_1.Input({
    schema: graphql_tag_1.default `
    input LodashOperations {
      ${lodashProps_1.default}
    }
  `,
});
exports.DummyArgument = new oda_gen_common_1.Enum({
    schema: graphql_tag_1.default `
    enum DummyArgument {
      none
    }
  `,
});
exports.ConvertTypeArgument = new oda_gen_common_1.Enum({
    schema: graphql_tag_1.default `
    enum ConvertTypeArgument {
      toNumber
      toString
    }
  `,
});
exports.default = new oda_gen_common_1.Schema({
    name: 'LodashSchema',
    items: [
        exports.Path,
        exports.RegularExpression,
        exports.Predicate,
        exports.Directives,
        exports.LodashOperations,
        exports.DummyArgument,
        exports.ConvertTypeArgument,
    ],
});
//# sourceMappingURL=lodashSchema.js.map