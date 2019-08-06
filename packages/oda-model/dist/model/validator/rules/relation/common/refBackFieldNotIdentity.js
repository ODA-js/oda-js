"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-common-ref-backFielnd-is-not-identity-fix';
        this.description = 'back field is not identity. fixed';
    }
    validate(context) {
        const result = [];
        if (context.relation.ref.backField) {
            const bf = context.entity.fields.get(context.relation.ref.backField);
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
//# sourceMappingURL=refBackFieldNotIdentity.js.map