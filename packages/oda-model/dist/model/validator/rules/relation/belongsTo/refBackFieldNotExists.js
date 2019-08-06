"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-belongsTo-ref-backFielnd-not-exists-fix';
        this.description = 'back field not exists. removed.';
    }
    validate(context) {
        const result = [];
        if (context.relation.ref.backField) {
            const bf = context.entity.fields.get(context.relation.ref.backField);
            if (!bf) {
                context.relation.ref.backField = '';
                result.push({
                    message: this.description,
                    result: 'fixable',
                });
            }
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=refBackFieldNotExists.js.map