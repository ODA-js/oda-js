"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const modelbase_1 = require("./modelbase");
const decapitalize_1 = __importDefault(require("./../lib/decapitalize"));
class FieldBase extends modelbase_1.ModelBase {
    constructor() {
        super(...arguments);
        this.modelType = 'field';
    }
    get entity() {
        return this.$obj.entity;
    }
    get type() {
        return this.$obj.type;
    }
    get inheritedFrom() {
        return this.$obj.inheritedFrom;
    }
    get args() {
        return this.$obj.args;
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            this.$obj.name = decapitalize_1.default(this.$obj.name);
            this.$obj.name_ = decapitalize_1.default(this.$obj.name_);
            let $entity = obj.entity;
            let entity = $entity;
            let args = obj.args;
            let $args = obj.args;
            let $type = obj.type;
            let type = $type || 'String';
            result.inheritedFrom = obj.inheritedFrom;
            result.type_ = $type;
            result.type = type;
            result.entity = entity;
            result.entity_ = $entity;
            result.args = args;
            result.args_ = $args;
            this.$obj = result;
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { entity: props.entity || props.entity_, type: props.type_, inheritedFrom: props.inheritedFrom, args: props.args || props.args_ }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { type: props.type_, inheritedFrom: props.inheritedFrom, args: props.args_ }));
    }
}
exports.FieldBase = FieldBase;
//# sourceMappingURL=fieldbase.js.map