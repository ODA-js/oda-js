"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-belongsTo-ref-backFielnd-is-identity';
        this.description = 'back field is identity';
    }
    validate(context) {
        const result = [];
        if (context.relation.ref.backField) {
            const bf = context.entity.fields.get(context.relation.ref.backField);
            if (bf && bf.identity && typeof bf.identity === 'boolean') {
                result.push({
                    message: this.description,
                    result: 'critics',
                });
            }
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=refBackFieldIsIdentity.js.map