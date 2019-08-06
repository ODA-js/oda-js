"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-btm-ref-backFielnd-is-not-identity-fix';
        this.description = 'back field is not identity. fixed';
    }
    validate(context) {
        const result = [];
        if (context.relation.using && context.relation.using.backField) {
            const bf = context.entity.fields.get(context.relation.using.backField);
            if (bf && !bf.identity) {
                const update = bf.toJSON();
                update.identity = true;
                update.entity = context.entity.name;
                bf.updateWith(update);
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
//# sourceMappingURL=usingBackFieldNotIdentity.js.map