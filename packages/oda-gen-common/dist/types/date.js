"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_2 = require("graphql");
const empty_1 = require("./empty");
class DateType extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'DateType';
        this._resolver = {
            Date: {
                __serialize: value => {
                    return makeDate(value).toISOString();
                },
                __parseValue: value => {
                    return makeDate(value);
                },
                __parseLiteral: node => {
                    const { kind, value } = node;
                    let result;
                    switch (kind) {
                        case graphql_1.Kind.INT:
                        case graphql_1.Kind.FLOAT:
                            result = new Date(+value);
                            break;
                        case graphql_1.Kind.STRING:
                            result = new Date(value);
                            break;
                        default:
                            throw new graphql_2.GraphQLError(`Expected Data value, but got: ${value}`);
                    }
                    return result;
                },
            },
        };
        this._typeDef = {
            type: [
                `
      scalar Date
    `,
            ],
        };
    }
}
exports.DateType = DateType;
function makeDate(value) {
    let result;
    if (value instanceof Date) {
        result = value;
    }
    else if (typeof value === 'string') {
        result = new Date(value);
    }
    else if (typeof value === 'number') {
        result = new Date(value);
    }
    else {
        throw TypeError(`${value} is not Date type`);
    }
    return result;
}
//# sourceMappingURL=date.js.map