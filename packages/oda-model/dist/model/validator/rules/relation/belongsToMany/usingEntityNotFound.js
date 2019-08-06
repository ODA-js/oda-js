"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-btm-using-entity-not-found';
        this.description = 'using entity not found';
    }
    validate(context) {
        const result = [];
        if (context.relation.using) {
            const entity = context.package.entities.get(context.relation.using.entity);
            if (!entity) {
                const sysEntity = context.model.packages
                    .get('system')
                    .entities.get(context.relation.using.entity);
                if (sysEntity) {
                    context.package.addEntity(sysEntity);
                    result.push({
                        message: 'using entity resolved from system package',
                        result: 'fixable',
                    });
                }
                else {
                    result.push({
                        message: this.description,
                        result: 'error',
                    });
                }
            }
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=usingEntityNotFound.js.map