"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-common-not-supported-opposite';
        this.description = 'relation has unsupported opposite';
    }
    validate(context) {
        const result = [];
        if (context.relation.opposite) {
            const entity = context.package.entities.get(context.relation.ref.entity);
            if (entity && entity.fields.has(context.relation.opposite)) {
                const opposite = entity.fields.get(context.relation.opposite);
                if (!opposits[context.relation.verb][opposite.relation.verb]) {
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
const opposits = {
    BelongsTo: {
        HasOne: true,
        HasMany: true,
    },
    BelongsToMany: {
        BelongsToMany: true,
    },
    HasMany: {
        BelongsTo: true,
    },
    HasOne: {
        BelongsTo: true,
    },
};
//# sourceMappingURL=notCompatibleRelationEnds.js.map