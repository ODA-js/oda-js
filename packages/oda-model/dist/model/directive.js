"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const modelbase_1 = require("./modelbase");
class Directive extends modelbase_1.ModelBase {
    constructor() {
        super(...arguments);
        this.modelType = 'field';
    }
    get args() {
        return this.$obj.args;
    }
    get on() {
        return this.$obj.on;
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            this.$obj.args = obj.args;
            this.$obj.on = obj.on;
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { args: props.args, on: props.on }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { args: props.args, on: props.on }));
    }
}
exports.Directive = Directive;
//# sourceMappingURL=directive.js.map