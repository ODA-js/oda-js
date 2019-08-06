"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereMutationKind extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereMutationKind';
        this._typeDef = {
            entry: [
                `
      input WhereMutationKind {
        in: [MutationKind!]
      }
  `,
            ],
        };
    }
}
exports.WhereMutationKind = WhereMutationKind;
//# sourceMappingURL=whereMutationKind.js.map