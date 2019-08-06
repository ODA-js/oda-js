"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereDate extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereDate';
        this._typeDef = {
            entry: [
                `
      input WhereDate {
        eq: Date
        gt: Date
        gte: Date
        lt: Date
        lte: Date
        ne: Date
        in: [Date!]
        nin: [Date!]
        and: [WhereDate!]
        or: [WhereDate!]
        nor: [WhereDate!]
        not: [WhereDate!]
        exists: Boolean
        match: String
      }
  `,
            ],
        };
    }
}
exports.WhereDate = WhereDate;
//# sourceMappingURL=whereDate.js.map