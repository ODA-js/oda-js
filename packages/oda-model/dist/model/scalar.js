"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const modelbase_1 = require("./modelbase");
class Scalar extends modelbase_1.ModelBase {
    constructor(obj) {
        super(obj);
        this.modelType = 'scalar';
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            result.name = obj.name;
        }
    }
}
exports.Scalar = Scalar;
//# sourceMappingURL=scalar.js.map