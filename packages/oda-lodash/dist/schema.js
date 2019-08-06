"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_gen_common_1 = require("oda-gen-common");
const { deepMerge } = oda_gen_common_1.lib;
const graphql_tools_1 = require("graphql-tools");
const lodash_1 = require("./lodash");
class LodashSchema extends oda_gen_common_1.types.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'LodashSchema';
        this._composite = [
            new oda_gen_common_1.types.DefaultTypes({}),
            new lodash_1.LodashModule({}),
        ];
    }
    get typeDefs() {
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
    build() {
        super.build();
        this._resolver = deepMerge(this.resolver, {
            RootQuery: this.query,
        });
    }
    get resolvers() {
        return this.applyHooks(this.resolver);
    }
}
let _lodashAST;
function lodashAST() {
    if (!_lodashAST) {
        let current = new LodashSchema({});
        current.build();
        let schema = graphql_tools_1.makeExecutableSchema({
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
exports.lodashAST = lodashAST;
//# sourceMappingURL=schema.js.map