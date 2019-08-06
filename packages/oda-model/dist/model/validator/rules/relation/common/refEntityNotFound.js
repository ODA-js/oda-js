"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-common-ref-entity-not-found';
        this.description = 'referenced entity not found';
    }
    validate(context) {
        const result = [];
        const entity = context.package.entities.get(context.relation.ref.entity);
        if (!entity) {
            result.push({
                message: this.description,
                result: 'error',
            });
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=refEntityNotFound.js.map