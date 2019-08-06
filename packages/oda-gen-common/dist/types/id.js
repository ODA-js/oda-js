"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const empty_1 = require("./empty");
class IdType extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'IdType';
        this._resolver = {
            ID: {
                __serialize: String,
                __parseValue: String,
                __parseLiteral: parseLiteral,
            },
        };
        this._typeDef = {
            type: [
                `
      scalar ID
    `,
            ],
        };
    }
}
exports.IdType = IdType;
function parseLiteral(ast) {
    return ast.kind === graphql_1.Kind.STRING ? ast.value : null;
}
//# sourceMappingURL=id.js.map