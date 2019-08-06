"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const fieldbase_1 = require("./fieldbase");
class Operation extends fieldbase_1.FieldBase {
    constructor() {
        super(...arguments);
        this.modelType = 'operation';
    }
    get actionType() {
        return this.$obj.actionType;
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            result.actionType = obj.actionType;
            this.$obj = result;
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { actionType: props.actionType }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { actionType: props.actionType }));
    }
}
exports.Operation = Operation;
//# sourceMappingURL=operation.js.map