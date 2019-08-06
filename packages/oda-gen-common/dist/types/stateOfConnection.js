"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class StateOfConectionType extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'StateOfConectionType';
        this._resolver = {
            ImageSize: {
                __getValues: () => [
                    {
                        name: 'empty',
                        value: 'empty',
                        isDeprecated: false,
                    },
                    {
                        name: 'any',
                        value: 'any',
                        isDeprecated: false,
                    },
                ],
            },
        };
        this._typeDef = {
            entry: [
                `
      # State of Connection
      enum eSOC {
        empty
        any
      }
    `,
            ],
        };
    }
}
exports.StateOfConectionType = StateOfConectionType;
//# sourceMappingURL=stateOfConnection.js.map