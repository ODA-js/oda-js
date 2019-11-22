"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_gen_common_1 = require("oda-gen-common");
const lodashProps_1 = __importDefault(require("./lodashProps"));
class Path extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'Path';
        this._resolver = {
            Path: {
                __serialize: String,
                __parseValue: String,
                __parseLiteral: x => x.value,
            },
        };
        this._typeDef = {
            type: [
                `
      scalar Path
    `,
            ],
        };
    }
}
exports.Path = Path;
class RegularExpression extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'RegularExpression';
        this._typeDef = {
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
}
exports.RegularExpression = RegularExpression;
class Predicate extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'Predicate';
        this._typeDef = {
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
        ${lodashProps_1.default}
        }
    `,
            ],
        };
    }
}
exports.Predicate = Predicate;
class DirectiveLodash extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'DirectiveLodash';
        this._typeDef = {
            type: [
                `
      directive @_(
        ${lodashProps_1.default}
      ) on FIELD | QUERY
    `,
            ],
        };
    }
}
exports.DirectiveLodash = DirectiveLodash;
class LodashOperations extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'LodashOperations';
        this._typeDef = {
            type: [
                `
        input LodashOperations {
          ${lodashProps_1.default}
        }
    `,
            ],
        };
    }
}
exports.LodashOperations = LodashOperations;
class DummyArgument extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'DummyArgument';
        this._typeDef = {
            type: [
                `
      enum DummyArgument{
        none
      }
    `,
            ],
        };
    }
}
exports.DummyArgument = DummyArgument;
class ConvertTypeArgument extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'ConvertTypeArgument';
        this._typeDef = {
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
}
exports.ConvertTypeArgument = ConvertTypeArgument;
class LodashModule extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'LodashModule';
        this._composite = [
            new RegularExpression({}),
            new Path({}),
            new Predicate({}),
            new DirectiveLodash({}),
            new LodashOperations({}),
            new DummyArgument({}),
            new ConvertTypeArgument({}),
        ];
    }
}
exports.LodashModule = LodashModule;
//# sourceMappingURL=lodash.js.map