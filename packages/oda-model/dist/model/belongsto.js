"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const entityreference_1 = require("./entityreference");
const relationbase_1 = require("./relationbase");
class BelongsTo extends relationbase_1.RelationBase {
    get belongsTo() {
        return this.$obj.belongsTo;
    }
    get ref() {
        return this.$obj.belongsTo;
    }
    constructor(obj) {
        super(obj);
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            this.setMetadata('storage.single', true);
            this.setMetadata('storage.stored', true);
            this.setMetadata('storage.embedded', obj.embedded || false);
            this.setMetadata('verb', 'BelongsTo');
            let $belongsTo = obj.belongsTo;
            let belongsTo;
            if ($belongsTo) {
                belongsTo = new entityreference_1.EntityReference($belongsTo);
            }
            result.belongsTo_ = new entityreference_1.EntityReference($belongsTo).toString();
            result.belongsTo = belongsTo;
            this.$obj = result;
            this.initNames();
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { belongsTo: props.belongsTo ? props.belongsTo.toString() : undefined }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { belongsTo: props.belongsTo_ }));
    }
}
exports.BelongsTo = BelongsTo;
//# sourceMappingURL=belongsto.js.map