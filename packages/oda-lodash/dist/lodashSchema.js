"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_gen_common_1 = require("oda-gen-common");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const lodashProps = `
map: Path
keyBy: Path
each: LodashOperations
trim: DummyArgument
stringify: DummyArgument
toJSON: DummyArgument

# Creates an array of elements split into groups the length of size.
# If array can't be split evenly, the final chunk will be the remaining elements.
chunk: Int

# Creates a slice of array with n elements dropped from the beginning.
drop: Int

# Creates a slice of array with n elements dropped from the end.
dropRight: Int

# Creates a slice of array with n elements taken from the beginning.
take: Int

# Creates a slice of array with n elements taken from the end.
takeRight: Int

# Recursively flatten array up to depth times.
flattenDepth: Int

# The inverse of \`toPairs\`; this method returns an object composed from key-value
# pairs.
fromPairs: DummyArgument

# Gets the element at index n of array. If n is negative, the nth element from
# the end is returned.
nth: Int

# Reverses array so that the first element becomes the last, the second element
# becomes the second to last, and so on.
reverse: DummyArgument

# Creates a duplicate-free version of an array, in which only the first occurrence
# of each element is kept. The order of result values is determined by the order
# they occur in the array.
uniq: DummyArgument

uniqBy: Path

countBy: Path
filter: JSON
reject: JSON
filterIf: Predicate
rejectIf: Predicate
groupBy: Path
sortBy: [Path!]
match: RegExpr
isMatch: RegExpr

minBy: Path
maxBy: Path
meanBy: Path
sumBy: Path

# Converts all elements in array into a string separated by separator.
join: String

get: Path
# push selected item donw to the specified path
dive: Path
# get all fields of specified path to current object
assign: [Path!]
mapValues: Path

convert: ConvertTypeArgument

# Creates an array of values corresponding to paths of object.
at: [Path!]
# Creates an array of own enumerable string keyed-value pairs for object.
toPairs: DummyArgument

# Creates an object composed of the inverted keys and values of object.
# If object contains duplicate values, subsequent values overwrite property
# assignments of previous values.
invert: DummyArgument

invertBy: Path
# Creates an array of the own enumerable property names of object.
keys: DummyArgument
# Creates an array of the own enumerable string keyed property values of object.
values: DummyArgument
`;
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
      ${lodashProps}
    }
  `,
});
exports.Directives = new oda_gen_common_1.Directive({
    schema: graphql_tag_1.default `
    directive @_(
      ${lodashProps}
    ) on FIELD | QUERY
  `,
});
exports.LodashOperations = new oda_gen_common_1.Input({
    schema: graphql_tag_1.default `
    input LodashOperations {
      ${lodashProps}
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