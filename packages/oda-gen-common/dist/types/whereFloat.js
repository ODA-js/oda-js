"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereFloat extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereFloat';
        this._typeDef = {
            entry: [
                `
      input WhereFloat {
        eq: Float
        gt: Float
        gte: Float
        lt: Float
        lte: Float
        ne: Float
        in: [Float!]
        nin: [Float!]
        and: [WhereFloat!]
        or: [WhereFloat!]
        nor: [WhereFloat!]
        not: [WhereFloat!]
        exists: Boolean
      }
  `,
            ],
        };
    }
}
exports.WhereFloat = WhereFloat;
//# sourceMappingURL=whereFloat.js.map