"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor() {
        this.name = 'model-no-default-package';
        this.description = 'model have default package';
    }
    validate(context) {
        const result = [];
        if (!context.model.name) {
            result.push({
                message: this.description,
                result: 'error',
            });
        }
        return result;
    }
}
exports.default = default_1;
//# sourceMappingURL=defaultPackage.js.map