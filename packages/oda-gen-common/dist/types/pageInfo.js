"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class PageInfoType extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'PageInfoType';
        this._typeDef = {
            entry: [
                `
    type PageInfo {
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
      startCursor: String
      endCursor: String
      count: Int
    }
  `,
            ],
        };
    }
}
exports.PageInfoType = PageInfoType;
//# sourceMappingURL=pageInfo.js.map