"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-common-ref-backFielnd-not-exists-fix';
        this.description = 'back field not exists. fixed.';
    }
    validate(context) {
        const result = [];
        if (context.relation.ref.backField) {
            const bf = context.entity.fields.get(context.relation.ref.backField);
            if (!bf) {
                context.relation.ref.backField = 'id';
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