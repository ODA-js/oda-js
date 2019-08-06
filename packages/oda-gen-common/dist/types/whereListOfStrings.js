"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class WhereListOfStrings extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'WhereListOfStrings';
        this._typeDef = {
            entry: [
                `
      input WhereListOfStrings {
        contains: String
        some: [String!]
        every: [String!]
        except: String
        none: [String!]
      }
  `,
            ],
        };
    }
}
exports.WhereListOfStrings = WhereListOfStrings;
//# sourceMappingURL=whereListOfStrings.js.map