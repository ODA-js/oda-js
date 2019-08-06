"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-common-ref-field-not-found';
        this.description = 'referenced field not found';
    }
    validate(context) {
        const result = [];
        const entity = context.package.entities.get(context.relation.ref.entity);
        if (entity) {
            let refField = entity.fields.get(context.relation.ref.field);
            if (!refField) {
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
//# sourceMappingURL=refFieldNotFound.js.map