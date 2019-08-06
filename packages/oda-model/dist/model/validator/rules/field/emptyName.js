"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'field-empty-name';
        this.description = 'field must be named';
    }
    validate(context) {
        const result = [];
        if (!context.field.name) {
            result.push({
                message: this.description,
                result: 'error',
            });
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=emptyName.js.map