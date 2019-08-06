"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const empty_1 = require("./empty");
class JSONType extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'JSONType';
        this._resolver = {
            JSON: {
                __serialize: identity,
                __parseValue: identity,
                __parseLiteral: parseLiteral,
            },
        };
        this._typeDef = {
            entry: [
                `
      scalar JSON
    `,
            ],
        };
    }
}
exports.JSONType = JSONType;
function identity(value) {
    return value;
}
function parseLiteral(ast) {
    let result;
    switch (ast.kind) {
        case graphql_1.Kind.STRING:
        case graphql_1.Kind.BOOLEAN:
            result = ast.value;
            break;
        case graphql_1.Kind.INT:
        case graphql_1.Kind.FLOAT:
            result = parseFloat(ast.value);
            break;
        case graphql_1.Kind.OBJECT:
            const value = Object.create(null);
            ast.fields.forEach(field => {
                value[field.name.value] = parseLiteral(field.value);
            });
            result = value;
            break;
        case graphql_1.Kind.LIST:
            result = ast.values.map(parseLiteral);
            break;
        default:
            result = null;
            break;
    }
    return result;
}
//# sourceMappingURL=json.js.map