"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-btm-using-field-not-found';
        this.description = 'using entity not found';
    }
    validate(context) {
        const result = [];
        if (context.relation.using) {
            const entity = context.package.entities.get(context.relation.using.entity);
            if (entity) {
                let refField = entity.fields.get(context.relation.using.field);
                if (!refField) {
                    result.push({
                        message: this.description,
                        result: 'warning',
                    });
                }
            }
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=usingFieldNotExists.js.map