"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-btm-ref-backFielnd-not-exists-fix';
        this.description = 'back field not exists. fixed.';
    }
    validate(context) {
        const result = [];
        if (context.relation.using && context.relation.using.backField) {
            const bf = context.entity.fields.get(context.relation.using.backField);
            if (!bf) {
                context.relation.using.backField = 'id';
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
//# sourceMappingURL=usingBackFieldNotExists.js.map