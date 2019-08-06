"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entitybase_1 = require("./entitybase");
class Mixin extends entitybase_1.EntityBase {
    constructor(obj) {
        super(obj);
        this.modelType = 'mixin';
    }
}
exports.Mixin = Mixin;
//# sourceMappingURL=mixin.js.map