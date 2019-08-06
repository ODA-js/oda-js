"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereInt extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereInt';
        this._typeDef = {
            entry: [
                `
      input WhereInt {
        eq: Int
        gt: Int
        gte: Int
        lt: Int
        lte: Int
        ne: Int
        in: [Int!]
        nin: [Int!]
        and: [WhereInt!]
        or: [WhereInt!]
        nor: [WhereInt!]
        not: [WhereInt!]
        exists: Boolean
      }
  `,
            ],
        };
    }
}
exports.WhereInt = WhereInt;
//# sourceMappingURL=whereInt.js.map