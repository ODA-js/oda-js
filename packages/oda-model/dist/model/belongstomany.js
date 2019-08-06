"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const decapitalize_1 = __importDefault(require("./../lib/decapitalize"));
const entityreference_1 = require("./entityreference");
const relationbase_1 = require("./relationbase");
class BelongsToMany extends relationbase_1.RelationBase {
    get belongsToMany() {
        return this.$obj.belongsToMany;
    }
    get using() {
        return this.$obj.using;
    }
    get ref() {
        return this.$obj.belongsToMany;
    }
    constructor(obj) {
        super(obj);
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            let $belongsToMany = obj.belongsToMany;
            this.setMetadata('storage.single', false);
            this.setMetadata('storage.stored', false);
            this.setMetadata('storage.embedded', obj.embedded || false);
            this.setMetadata('verb', 'BelongsToMany');
            let $using = obj.using;
            let belongsToMany;
            if ($belongsToMany) {
                belongsToMany = new entityreference_1.EntityReference($belongsToMany);
                if (!belongsToMany.backField) {
                    belongsToMany.backField = 'id';
                }
            }
            let using;
            if ($using) {
                using = new entityreference_1.EntityReference($using);
                if (!using.$obj.field) {
                    using.$obj.field = using.$obj._field = decapitalize_1.default(obj.entity);
                }
            }
            if (using && !using.backField) {
                using.backField = 'id';
            }
            result.belongsToMany_ = new entityreference_1.EntityReference($belongsToMany).toString();
            result.belongsToMany = belongsToMany;
            result.using_ = $using;
            result.using = using;
            this.$obj = result;
            this.initNames();
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { belongsToMany: props.belongsToMany
                ? props.belongsToMany.toString()
                : undefined, using: props.using ? props.using.toString() : undefined }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { belongsToMany: props.belongsToMany_, using: props.using_ }));
    }
}
exports.BelongsToMany = BelongsToMany;
//# sourceMappingURL=belongstomany.js.map