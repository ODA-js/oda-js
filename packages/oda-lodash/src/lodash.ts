import { types } from 'oda-gen-common';

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
    type: [`
      scalar Path
    `],
  };
}

export class RegularExpression extends types.GQLModule {
  protected _name = 'RegularExpression';

  protected _typeDef = {
    type: [`
        input RegExpr {
          match: String!
          flags: String
        }
    `],
  };
}

export class Predicate extends types.GQLModule {
  protected _name = 'Predicate';
  protected _typeDef = {
    type: [`
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
    `],
  };
}

export class DirectiveLodash extends types.GQLModule {
  protected _name = 'DirectiveLodash';
  protected _typeDef = {
    type: [`
      directive @_(
        ${lodashProps}
      ) on FIELD | QUERY
    `],
  };
}

export class LodashOperations extends types.GQLModule {
  protected _name = 'LodashOperations';
  protected _typeDef = {
    type: [`
        input LodashOperations {
          ${lodashProps}
        }
    `],
  };
}

export class DummyArgument extends types.GQLModule {
  protected _name = 'DummyArgument';
  protected _typeDef = {
    type: [`
      enum DummyArgument{
        none
      }
    `],
  };
}

export class ConvertTypeArgument extends types.GQLModule {
  protected _name = 'ConvertTypeArgument';
  protected _typeDef = {
    type: [`
      enum ConvertTypeArgument{
        toNumber
        toString
      }
    `],
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

