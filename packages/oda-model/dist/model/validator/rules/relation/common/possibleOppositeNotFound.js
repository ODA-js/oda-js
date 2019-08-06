"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-common-possible-opposite';
        this.description = 'relation-common-possible-opposite';
    }
    validate(context) {
        const result = [];
        if (!context.relation.opposite) {
            const entity = context.package.entities.get(context.relation.ref.entity);
            if (entity) {
                let opposites = Array.from(entity.fields.values()).filter(f => f.relation &&
                    ((f.relation.ref.entity === context.entity.name &&
                        f.relation.ref.field === context.field.name) ||
                        (f.relation.using &&
                            this.using &&
                            f.relation.using.entity ===
                                this.using.entity)));
                if (opposites.length > 2) {
                    result.push({
                        message: 'more than one possible opposite',
                        result: 'error',
                    });
                }
                if (opposites.length === 1) {
                    context.relation.opposite = opposites[0].name;
                    result.push({
                        message: 'found one possible opposite. assigned.',
                        result: 'fixable',
                    });
                }
                if (opposites.length === 0) {
                    result.push({
                        message: 'no possible opposite',
                        result: 'critics',
                    });
                }
            }
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=possibleOppositeNotFound.js.map