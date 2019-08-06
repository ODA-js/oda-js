"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'relation-common-owner-field-unnecessery-indexed-fix';
        this.description = 'owner relation field is unnecessery indexed';
    }
    validate(context) {
        const result = [];
        if (!!context.field.identity || !!context.field.indexed) {
            const update = context.field.toJSON();
            delete update.identity;
            delete update.indexed;
            delete update.metadata.storage.identity;
            delete update.metadata.storage.indexed;
            delete update.metadata.storage.required;
            update.entity = context.entity.name;
            context.field.updateWith(update);
            context.entity.ensureIndexes();
            result.push({
                message: this.description,
                result: 'fixable',
            });
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=ownerFieldUnnecesseryIndexed.js.map