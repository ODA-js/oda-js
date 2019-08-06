"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereJSON extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereJSON';
        this._typeDef = {
            entry: [
                `
      input WhereJSON {
        query: JSON!
      }
  `,
            ],
        };
    }
}
exports.WhereJSON = WhereJSON;
//# sourceMappingURL=whereJSON.js.map