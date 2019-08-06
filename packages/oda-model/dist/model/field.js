"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const belongsto_1 = require("./belongsto");
const belongstomany_1 = require("./belongstomany");
const entityreference_1 = require("./entityreference");
const fieldbase_1 = require("./fieldbase");
const hasmany_1 = require("./hasmany");
const hasone_1 = require("./hasone");
function discoverFieldType(obj) {
    if (obj.hasOne) {
        return 'HasOne';
    }
    else if (obj.hasMany) {
        return 'HasMany';
    }
    else if (obj.belongsTo) {
        return 'BelongsTo';
    }
    else if (obj.belongsToMany) {
        return 'BelongsToMany';
    }
    else {
        console.warn(`undefined relation type of ${JSON.stringify(obj)}`);
        return 'undefined';
    }
}
class Field extends fieldbase_1.FieldBase {
    constructor(obj) {
        super(obj);
    }
    get derived() {
        return this.getMetadata('storage.derived');
    }
    get persistent() {
        return this.getMetadata('storage.persistent');
    }
    get defaultValue() {
        return this.getMetadata('defaultValue');
    }
    get list() {
        return this.$obj.list;
    }
    get map() {
        return this.$obj.map;
    }
    get identity() {
        return this.getMetadata('storage.identity');
    }
    makeIdentity() {
        this.$obj.idKey = new entityreference_1.EntityReference(this.$obj.entity, this.$obj.name, 'id');
        this.setMetadata('storage.identity', true);
        this.setMetadata('storage.indexed', true);
        this.setMetadata('storage.required', true);
    }
    get required() {
        return this.getMetadata('storage.required');
    }
    get indexed() {
        return this.getMetadata('storage.indexed');
    }
    get idKey() {
        return this.$obj.idKey;
    }
    get order() {
        return this.getMetadata('order');
    }
    get relation() {
        return this.$obj.relation;
    }
    set relation(value) {
        this.$obj.relation = value;
    }
    getRefType(pkg) {
        if (this.relation) {
            let ref = this.relation.ref;
            let link = ref.toString();
            if (pkg.identityFields.has(link)) {
                let entity = pkg.identityFields.get(link);
                if (entity.fields.has(ref.field)) {
                    return entity.fields.get(ref.field).type;
                }
            }
        }
    }
    clone() {
        return new this.constructor(this.toObject());
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            result.map = obj.map || result.map || false;
            result.list = obj.list || result.list || false;
            this.setMetadata('storage.derived', obj.derived ||
                (Array.isArray(obj.args) && obj.args.length > 0) ||
                this.getMetadata('storage.derived'));
            this.setMetadata('storage.persistent', obj.persistent ||
                !(obj.derived ||
                    this.getMetadata('storage.derived') ||
                    (Array.isArray(obj.args) && obj.args.length > 0)));
            if (obj.defaultValue && !this.derived) {
                this.setMetadata('defaultValue', obj.defaultValue);
            }
            this.setMetadata('storage.identity', obj.identity);
            this.setMetadata('storage.required', obj.required || (obj.identity && obj.required !== false));
            this.setMetadata('storage.indexed', obj.indexed || obj.identity);
            if (this.getMetadata('storage.identity', false)) {
                result.idKey = new entityreference_1.EntityReference(result.entity, result.name, 'id');
            }
            const isIdentity = this.getMetadata('storage.identity', false);
            if (isIdentity || obj.relation) {
                this.setMetadata('defaultValue', undefined);
            }
            if (typeof obj.type === 'object') {
                if (obj.type.type === 'entity') {
                    const type = obj.type;
                    let relation;
                    switch (type.multiplicity) {
                        case 'one': {
                            relation = new hasone_1.HasOne({
                                hasOne: `${type.name}#`,
                                entity: obj.entity,
                                field: obj.name,
                                embedded: true,
                            });
                            break;
                        }
                        case 'many': {
                            relation = new hasmany_1.HasMany({
                                hasMany: `${type.name}#`,
                                entity: obj.entity,
                                field: obj.name,
                                embedded: true,
                            });
                            break;
                        }
                        default:
                    }
                    result.relation = relation;
                }
            }
            else if (obj.relation && !isIdentity) {
                let $relation = obj.relation;
                let relation;
                switch (discoverFieldType($relation)) {
                    case 'HasOne':
                        relation = new hasone_1.HasOne(Object.assign({}, $relation, { entity: obj.entity, field: obj.name }));
                        break;
                    case 'HasMany':
                        relation = new hasmany_1.HasMany(Object.assign({}, $relation, { entity: obj.entity, field: obj.name }));
                        break;
                    case 'BelongsToMany':
                        relation = new belongstomany_1.BelongsToMany(Object.assign({}, $relation, { entity: obj.entity, field: obj.name }));
                        break;
                    case 'BelongsTo':
                        relation = new belongsto_1.BelongsTo(Object.assign({}, $relation, { entity: obj.entity, field: obj.name }));
                        break;
                    default:
                        throw new Error('undefined type');
                }
                result.map = false;
                result.list = false;
                result.relation = relation;
                delete result.type_;
                delete result.type;
            }
            this.$obj = result;
        }
    }
    toObject(modelPackage) {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { derived: this.derived, defaultValue: this.defaultValue, persistent: this.persistent, entity: props.entity, type: props.type || props.type_, inheritedFrom: props.inheritedFrom, list: props.list, map: props.map, idKey: props.idKey ? props.idKey.toString() : undefined, relation: props.relation ? props.relation.toObject() : undefined }));
    }
    toJSON(modelPackage) {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { derived: this.derived, defaultValue: this.defaultValue, persistent: this.persistent, list: props.list, map: props.map, relation: props.relation ? props.relation.toJSON() : undefined }));
    }
}
exports.Field = Field;
//# sourceMappingURL=field.js.map