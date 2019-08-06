"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-belongsTo-owner-field-is-identity';
        this.description = 'owner field is identity';
    }
    validate(context) {
        const result = [];
        if (!context.relation.ref.backField &&
            !!context.field.identity &&
            typeof !!context.field.identity === 'boolean') {
            result.push({
                message: this.description,
                result: 'critics',
            });
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=ownerFieldIsIdentity.js.map