"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase_1 = __importDefault(require("camelcase"));
const inflected = __importStar(require("inflected"));
const decapitalize_1 = __importDefault(require("./../lib/decapitalize"));
const clean_1 = __importDefault(require("../lib/json/clean"));
const definitions_1 = require("./definitions");
class EntityReference {
    constructor(entity, field, backField) {
        this.modelType = 'ref';
        if (typeof entity === 'string' && !field) {
            let res = entity.match(definitions_1.REF_PATTERN);
            if (res && res.length > 0) {
                this.$obj = {
                    backField: res[1],
                    backField_: res[1],
                    entity: inflected.classify(res[2]),
                    entity_: res[2],
                    field: camelcase_1.default(res[3].trim()),
                    field_: camelcase_1.default(res[3].trim()) || definitions_1.DEFAULT_ID_FIELDNAME,
                };
            }
        }
        else if (typeof entity === 'string') {
            this.$obj = {
                backField: backField,
                backField_: backField,
                entity: inflected.classify(entity),
                entity_: entity,
                field: field,
                field_: field || definitions_1.DEFAULT_ID_FIELDNAME,
            };
        }
        else if (entity instanceof Object) {
            this.$obj = {
                backField: entity.backField,
                backField_: entity.backField,
                entity: inflected.classify(entity.entity),
                entity_: entity.entity,
                field: entity.field,
                field_: entity.field || definitions_1.DEFAULT_ID_FIELDNAME,
            };
        }
        this.$obj.field = this.$obj.field && decapitalize_1.default(this.$obj.field);
        this.$obj.field_ = this.$obj.field_ && decapitalize_1.default(this.$obj.field_);
        this.$obj.backField =
            this.$obj.backField && decapitalize_1.default(this.$obj.backField);
        this.$obj.backField_ =
            this.$obj.backField_ && decapitalize_1.default(this.$obj.backField_);
    }
    get entity() {
        return this.$obj.entity || this.$obj.entity_;
    }
    set entity(value) {
        this.$obj.entity_ = value;
    }
    get field() {
        return this.$obj.field || this.$obj.field_ || definitions_1.DEFAULT_ID_FIELDNAME;
    }
    set field(value) {
        this.$obj.field_ = value;
    }
    get backField() {
        return this.$obj.backField || this.$obj.backField_;
    }
    set backField(value) {
        this.$obj.backField_ = value;
    }
    clone() {
        return new this.constructor(this);
    }
    toObject() {
        return clean_1.default({
            backField: this.$obj.backField,
            entity: this.$obj.entity,
            field: this.$obj.field,
        });
    }
    toJSON() {
        return clean_1.default({
            backField: this.$obj.backField_,
            entity: this.$obj.entity_,
            field: this.$obj.field_,
        });
    }
    updateWith(obj) {
        this.backField = obj.backField || this.backField;
        this.field = obj.field || this.field;
        this.entity = obj.entity || this.entity;
    }
    toString() {
        return `${this.backField ? this.backField + '@' : ''}${this.entity}#${this
            .field || definitions_1.DEFAULT_ID_FIELDNAME}`;
    }
}
exports.EntityReference = EntityReference;
//# sourceMappingURL=entityreference.js.map