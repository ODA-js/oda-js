"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereString extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereString';
        this._typeDef = {
            entry: [
                `
      input WhereString {
        eq: String
        ne: String
        in: [String!]
        nin: [String!]
        and: [WhereString!]
        or: [WhereString!]
        nor: [WhereString!]
        not: [WhereString!]
        exists: Boolean
        match: String
        imatch: String
      }
  `,
            ],
        };
    }
}
exports.WhereString = WhereString;
//# sourceMappingURL=whereString.js.map