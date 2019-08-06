"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-btm-ref-and-using-entities-not-found-remove';
        this.description = 'referenced and using entities not found. remove relation';
    }
    validate(context) {
        const result = [];
        const entity = context.package.entities.get(context.relation.ref.entity);
        if (!entity) {
            if (context.relation.using.entity) {
                const refEntity = context.package.entities.get(context.relation.using.entity);
                if (!refEntity) {
                    const update = context.field.toJSON();
                    delete update.relation;
                    update.entity = context.entity.name;
                    context.field.updateWith(update);
                    result.push({
                        message: this.description,
                        result: 'fixable',
                    });
                }
            }
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=refAndUsingEntitiesNotFound.js.map