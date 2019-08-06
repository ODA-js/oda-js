"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereBoolean extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereBoolean';
        this._typeDef = {
            entry: [
                `
      input WhereBoolean {
        eq: Boolean
        ne: Boolean
        exists: Boolean
      }
  `,
            ],
        };
    }
}
exports.WhereBoolean = WhereBoolean;
//# sourceMappingURL=whereBoolean.js.map