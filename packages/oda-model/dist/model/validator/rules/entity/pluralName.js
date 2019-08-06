"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'entity-plural-name-the-same';
        this.description = 'plural form of entity`s name of entity must be different from its singular form';
    }
    validate(context) {
        const result = [];
        if (context.entity.name === context.entity.plural) {
            result.push({
                entity: context.entity.name,
                message: this.description,
                result: 'error',
            });
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=pluralName.js.map