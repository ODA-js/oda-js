"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const entityreference_1 = require("./entityreference");
const relationbase_1 = require("./relationbase");
class HasMany extends relationbase_1.RelationBase {
    get hasMany() {
        return this.$obj.hasMany;
    }
    get ref() {
        return this.$obj.hasMany;
    }
    constructor(obj) {
        super(obj);
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            this.setMetadata('storage.single', false);
            this.setMetadata('storage.stored', false);
            this.setMetadata('storage.embedded', obj.embedded || false);
            this.setMetadata('verb', 'HasMany');
            let $hasMany = obj.hasMany;
            let hasMany;
            if ($hasMany) {
                hasMany = new entityreference_1.EntityReference($hasMany);
                if (!hasMany.backField) {
                    hasMany.backField = 'id';
                }
            }
            result.hasMany_ = new entityreference_1.EntityReference($hasMany).toString();
            result.hasMany = hasMany;
            this.$obj = result;
            this.initNames();
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { hasMany: props.hasMany ? props.hasMany.toString() : undefined }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { hasMany: props.hasMany_ }));
    }
}
exports.HasMany = HasMany;
//# sourceMappingURL=hasmany.js.map