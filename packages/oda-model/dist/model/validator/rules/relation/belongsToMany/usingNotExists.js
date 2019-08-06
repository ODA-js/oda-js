"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-btm-ref-using-is-not-exists-for-belongs-to-many-relation';
        this.description = 'using is not exists for belongs to many relation';
    }
    validate(context) {
        const result = [];
        if (!context.relation.using) {
            result.push({
                message: this.description,
                result: 'warning',
            });
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=usingNotExists.js.map