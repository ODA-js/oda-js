"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inflected = __importStar(require("inflected"));
const clean_1 = __importDefault(require("../lib/json/clean"));
const fold_1 = __importDefault(require("./../lib/json/fold"));
const entityreference_1 = require("./entityreference");
const index_1 = require("./index");
const metadata_1 = require("./metadata");
const decapitalize_1 = __importDefault(require("../lib/decapitalize"));
class RelationBase extends metadata_1.Metadata {
    get modelType() {
        return this.verb;
    }
    validate(validator) {
        return validator.check(this);
    }
    constructor(obj) {
        super(obj);
        if (obj) {
            this.updateWith(fold_1.default(obj));
        }
    }
    get name() {
        return this.$obj.name;
    }
    get field() {
        return this.$obj.field;
    }
    get entity() {
        return this.$obj.entity;
    }
    get fields() {
        return this.$obj.fields;
    }
    get ref() {
        return new entityreference_1.EntityReference({ entity: '', field: '', backField: '' });
    }
    get verb() {
        return this.getMetadata('verb');
    }
    get single() {
        return this.getMetadata('storage.single');
    }
    get stored() {
        return this.getMetadata('storage.stored');
    }
    get embedded() {
        return this.getMetadata('storage.embedded');
    }
    get opposite() {
        return this.$obj.opposite;
    }
    set opposite(val) {
        this.$obj.opposite = val;
    }
    initNames() {
        let ref = this.single
            ? inflected.singularize(this.$obj.field)
            : inflected.pluralize(this.$obj.field);
        this.getMetadata('name.full', this.name ||
            `${this.$obj.entity}${this.verb}${inflected.camelize(ref, true)}`);
        let ref1 = this.single
            ? inflected.singularize(this.$obj.field)
            : inflected.pluralize(this.$obj.field);
        this.setMetadata('name.normal', `${this.$obj.entity}${inflected.camelize(ref1, true)}`);
        let ref2 = this.single
            ? inflected.singularize(this.$obj.field)
            : inflected.pluralize(this.$obj.field);
        this.getMetadata('name.short', `${inflected.camelize(ref2, true)}`);
    }
    get fullName() {
        let result = this.getMetadata('name.full');
        if (!result) {
            this.initNames();
            result = this.getMetadata('name.full');
        }
        return result;
    }
    get normalName() {
        let result = this.getMetadata('name.normal');
        if (!result) {
            this.initNames();
            result = this.getMetadata('name.normal');
        }
        return result;
    }
    get shortName() {
        let result = this.getMetadata('name.short');
        if (!result) {
            this.initNames();
            result = this.getMetadata('name.short');
        }
        return result;
    }
    toString() {
        return JSON.stringify(this.toObject());
    }
    toObject() {
        let props = this.$obj;
        return clean_1.default(Object.assign({}, super.toObject(), { name: props.name || props.name_, entity: props.entity, field: props.field, fields: props.fields && Array.from(props.fields.values()), opposite: props.opposite, embedded: this.embedded || undefined }));
    }
    toJSON() {
        let props = this.$obj;
        return clean_1.default(Object.assign({}, super.toJSON(), { name: props.name_, fields: props.fields && Array.from(props.fields.values()), opposite: props.opposite, embedded: this.embedded || undefined }));
    }
    updateWith(obj) {
        if (obj) {
            const result = Object.assign({}, this.$obj);
            let $name = obj.name;
            let opposite = obj.opposite && decapitalize_1.default(obj.opposite);
            let name = $name ? inflected.camelize($name.trim()) : $name;
            result.name_ = $name;
            result.name = name;
            result.opposite = opposite;
            if (obj.fields) {
                result.fields = new Map();
                if (Array.isArray(obj.fields)) {
                    obj.fields.forEach(f => {
                        result.fields.set(f.name, new index_1.Field(f));
                    });
                }
                else {
                    Object.keys(obj.fields).forEach(f => {
                        result.fields.set(f, new index_1.Field(Object.assign({ name: f }, obj.fields[f])));
                    });
                }
            }
            let $entity = obj.entity;
            let entity = $entity;
            let $field = obj.field;
            let field = $field;
            result.entity = entity;
            result.entity_ = $entity;
            result.field = field;
            result.field_ = $field;
            this.$obj = result;
        }
    }
}
exports.RelationBase = RelationBase;
//# sourceMappingURL=relationbase.js.map