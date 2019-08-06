"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class StateOfFieldType extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'StateOfFieldType';
        this._resolver = {
            ImageSize: {
                __getValues: () => [
                    {
                        name: 'assigned',
                        value: 'assigned',
                        isDeprecated: false,
                    },
                    {
                        name: 'void',
                        value: 'void',
                        isDeprecated: false,
                    },
                ],
            },
        };
        this._typeDef = {
            entry: [
                `
    # State of field
    enum eSOF {
      assigned
      void
    }
  `,
            ],
        };
    }
}
exports.StateOfFieldType = StateOfFieldType;
//# sourceMappingURL=stateOfField.js.map