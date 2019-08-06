"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-common-opposite-not-found';
        this.description = 'opposite field not found';
    }
    validate(context) {
        const result = [];
        if (context.relation.opposite) {
            const entity = context.package.entities.get(context.relation.ref.entity);
            if (entity && !entity.fields.has(context.relation.opposite)) {
                const update = context.relation.toObject();
                delete update.opposite;
                update.entity = context.entity.name;
                context.relation.updateWith(update);
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
//# sourceMappingURL=oppositeNotFound.js.map