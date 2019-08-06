"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-belongsTo-ref-backFielnd-not-indexed-fix';
        this.description = 'back field not indexed. fixed.';
    }
    validate(context) {
        const result = [];
        if (context.relation.ref.backField) {
            const bf = context.entity.fields.get(context.relation.ref.backField);
            if (bf && !bf.indexed) {
                const update = bf.toJSON();
                update.indexed = true;
                update.entity = context.entity.name;
                bf.updateWith(update);
                result.push({
                    message: this.description,
                    result: 'error',
                });
            }
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=refBackFieldNotIndexed.js.map