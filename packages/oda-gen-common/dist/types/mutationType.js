"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const empty_1 = require("./empty");
class MutationKindType extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'MutationKindType';
        this._resolver = {
            ImageSize: {
                __getValues: () => [
                    {
                        name: 'CREATED',
                        value: 'CREATED',
                        isDeprecated: false,
                    },
                    {
                        name: 'UPDATED',
                        value: 'UPDATED',
                        isDeprecated: false,
                    },
                    {
                        name: 'DELETED',
                        value: 'DELETED',
                        isDeprecated: false,
                    },
                    {
                        name: 'LINK',
                        value: 'LINK',
                        isDeprecated: false,
                    },
                    {
                        name: 'UNLINK',
                        value: 'UNLINK',
                        isDeprecated: false,
                    },
                ],
            },
        };
        this._typeDef = {
            entry: [
                `
      # Mutation type
      enum MutationKind {
        CREATE
        UPDATE
        DELETE
        LINK
        UNLINK
      }
    `,
            ],
        };
    }
}
exports.MutationKindType = MutationKindType;
//# sourceMappingURL=mutationType.js.map