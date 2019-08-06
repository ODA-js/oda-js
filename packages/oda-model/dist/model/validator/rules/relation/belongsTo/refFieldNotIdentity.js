"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-belongsTo-ref-field-not-identity-fix';
        this.description = 'referenced field not identity';
    }
    validate(context) {
        const result = [];
        const entity = context.package.entities.get(context.relation.ref.entity);
        if (entity) {
            let refField = entity.fields.get(context.relation.ref.field);
            if (refField && !refField.identity) {
                const update = refField.toJSON();
                update.identity = true;
                update.entity = context.entity.name;
                refField.updateWith(update);
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
//# sourceMappingURL=refFieldNotIdentity.js.map