"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereID extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereID';
        this._typeDef = {
            entry: [
                `
      input WhereID {
        eq: ID
        ne: ID
        in: [ID!]
        nin: [ID!]
        and: [WhereID!]
        or: [WhereID!]
        nor: [WhereID!]
        not: [WhereID!]
        exists: Boolean
      }
  `,
            ],
        };
    }
}
exports.WhereID = WhereID;
//# sourceMappingURL=whereID.js.map