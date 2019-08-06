"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-belongsTo-owner-field-is-not-indexed';
        this.description = 'owner field is not indexed';
    }
    validate(context) {
        const result = [];
        if (!context.relation.ref.backField && !context.field.indexed) {
            const update = context.field.toJSON();
            update.indexed = true;
            update.entity = context.entity.name;
            context.field.updateWith(update);
            result.push({
                message: this.description,
                result: 'fixable',
            });
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=ownerFieldNotIndexed.js.map