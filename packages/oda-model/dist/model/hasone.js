"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const entityreference_1 = require("./entityreference");
const relationbase_1 = require("./relationbase");
class HasOne extends relationbase_1.RelationBase {
    get hasOne() {
        return this.$obj.hasOne;
    }
    get ref() {
        return this.$obj.hasOne;
    }
    constructor(obj) {
        super(obj);
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            this.setMetadata('storage.single', true);
            this.setMetadata('storage.stored', false);
            this.setMetadata('storage.embedded', obj.embedded || false);
            this.setMetadata('verb', 'HasOne');
            let $hasOne = obj.hasOne;
            let hasOne;
            if ($hasOne) {
                hasOne = new entityreference_1.EntityReference($hasOne);
                if (!hasOne.backField) {
                    hasOne.backField = 'id';
                }
            }
            result.hasOne_ = new entityreference_1.EntityReference($hasOne).toString();
            result.hasOne = hasOne;
            this.$obj = result;
            this.initNames();
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { hasOne: props.hasOne ? props.hasOne.toString() : undefined }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { hasOne: props.hasOne_ }));
    }
}
exports.HasOne = HasOne;
//# sourceMappingURL=hasone.js.map