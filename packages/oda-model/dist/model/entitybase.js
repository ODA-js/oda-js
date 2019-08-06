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
const deepMerge_1 = __importDefault(require("./../lib/json/deepMerge"));
const definitions_1 = require("./definitions");
const field_1 = require("./field");
const modelbase_1 = require("./modelbase");
const operation_1 = require("./operation");
class EntityBase extends modelbase_1.ModelBase {
    constructor(obj) {
        super(obj);
        this.modelType = 'entitybase';
    }
    ensureIds(modelPackage) {
        this.identity.forEach(value => {
            let ids = this.fields.get(value);
            if (ids) {
                modelPackage.identityFields.set(ids.idKey.toString(), this);
            }
        });
    }
    ensureFKs(modelPackage) {
        if (modelPackage) {
            let modelRelations;
            if (modelPackage.relations.has(this.name)) {
                modelRelations = modelPackage.relations.get(this.name);
            }
            else {
                modelRelations = new Map();
                modelPackage.relations.set(this.name, modelRelations);
            }
            if (modelRelations) {
                this.relations.forEach(value => {
                    let ref = this.fields.get(value);
                    if (ref && modelRelations) {
                        modelRelations.set(ref.name, ref.clone());
                    }
                });
            }
        }
    }
    removeIds(modelPackage) {
        this.identity.forEach(value => {
            let ids = this.fields.get(value);
            if (ids) {
                modelPackage.identityFields.delete(ids.idKey.toString());
            }
        });
    }
    get plural() {
        return this.getMetadata('name.plural');
    }
    get titlePlural() {
        return this.getMetadata('titlePlural');
    }
    get relations() {
        return this.$obj.relations;
    }
    get required() {
        return this.$obj.required;
    }
    get identity() {
        return this.$obj.identity;
    }
    get fields() {
        return this.$obj.fields;
    }
    get operations() {
        return this.$obj.operations;
    }
    get indexed() {
        return this.$obj.indexed;
    }
    updateIndex(f) {
        let indexes = this.getMetadata('storage.indexes', {});
        if (f.indexed) {
            let indexName;
            if (typeof f.indexed === 'boolean') {
                indexName = f.name;
            }
            else if (Array.isArray(f.indexed)) {
                indexName = f.indexed;
            }
            else if (typeof f.indexed === 'string') {
                indexName = f.indexed.split(' ');
                indexName = indexName.length > 1 ? indexName : indexName[0];
            }
            let entry = {
                name: indexName,
                fields: {
                    [f.name]: 1,
                },
                options: {
                    sparse: true,
                },
            };
            if (typeof indexName === 'string') {
                this.mergeIndex(indexes, indexName, entry);
            }
            else {
                for (let i = 0, len = indexName.length; i < len; i++) {
                    let index = indexName[i];
                    this.mergeIndex(indexes, index, entry);
                }
            }
        }
    }
    updateUniqueIndex(f) {
        let indexes = this.getMetadata('storage.indexes', {});
        if (f.identity) {
            let indexName;
            if (typeof f.identity === 'boolean') {
                indexName = f.name;
            }
            else if (Array.isArray(f.identity)) {
                indexName = f.identity;
            }
            else if (typeof f.identity === 'string') {
                indexName = f.identity.split(' ');
                indexName = indexName.length > 1 ? indexName : indexName[0];
            }
            let entry = {
                name: indexName,
                fields: {
                    [f.name]: 1,
                },
                options: {
                    sparse: true,
                    unique: true,
                },
            };
            if (typeof indexName === 'string') {
                this.mergeIndex(indexes, indexName, entry);
            }
            else {
                for (let i = 0, len = indexName.length; i < len; i++) {
                    let index = indexName[i];
                    this.mergeIndex(indexes, index, entry);
                }
            }
        }
    }
    mergeIndex(indexes, index, entry) {
        if (indexes.hasOwnProperty(index)) {
            indexes[index] = deepMerge_1.default(indexes[index], entry);
            if (Array.isArray(indexes[index].name)) {
                indexes[index].name = indexes[index].name[0];
            }
            else {
                indexes[index].name = indexes[index].name;
            }
        }
        else {
            indexes[index] = entry;
        }
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            result.name =
                this.getMetadata('name.singular') || inflected.classify(result.name);
            if (obj.titlePlural) {
                this.setMetadata('titlePlural', obj.titlePlural);
            }
            let $plural = obj.plural || this.getMetadata('name.plural');
            if (!$plural) {
                $plural = inflected.pluralize(result.name);
            }
            if (!this.getMetadata('titlePlural')) {
                this.setMetadata('titlePlural', $plural);
            }
            this.setMetadata('name.singular', result.name);
            this.setMetadata('name.plural', $plural);
            result.name =
                result.name.slice(0, 1).toUpperCase() + result.name.slice(1);
            const fields = new Map();
            const operations = new Map();
            const relations = new Set();
            const identity = new Set();
            const required = new Set();
            const indexed = new Set();
            let traverse = (fld, index) => {
                let field = new field_1.Field(Object.assign({}, (fld.toJSON ? fld.toJSON() : fld), { metadata: Object.assign({ order: index }, fld.metadata), entity: result.name }));
                if (fields.has(field.name)) {
                    throw new Error(`the same field ${field.name} is already exists in ${obj.name} entry`);
                }
                fields.set(field.name, field);
                if (field.identity) {
                    identity.add(field.name);
                    this.updateUniqueIndex(field);
                }
                if (field.required) {
                    required.add(field.name);
                }
                if (field.relation) {
                    relations.add(field.name);
                }
                if (field.indexed) {
                    indexed.add(field.name);
                    this.updateIndex(field);
                }
            };
            const opTraverse = (op, index) => {
                const operation = new operation_1.Operation(Object.assign({}, (op.hasOwnProperty('toJSON') ? op.toJSON() : op), { metadata: Object.assign({ order: index }, op.metadata), entity: result.name }));
                if (fields.has(operation.name)) {
                    throw new Error(`the same field ${operation.name} is already exists in ${obj.name} entry`);
                }
                operations.set(operation.name, operation);
            };
            if (Array.isArray(obj.fields)) {
                obj.fields.forEach(traverse);
            }
            else {
                let fieldNames = Object.keys(obj.fields);
                for (let i = 0, len = fieldNames.length; i < len; i++) {
                    let fName = fieldNames[i];
                    traverse(Object.assign({}, obj.fields[fName], { name: fName }), i);
                }
            }
            if (Array.isArray(obj.operations)) {
                obj.operations.forEach(opTraverse);
            }
            else if (obj.operations) {
                let opName = Object.keys(obj.operations);
                for (let i = 0, len = opName.length; i < len; i++) {
                    let fName = opName[i];
                    opTraverse(Object.assign({}, obj.operations[fName], { name: fName }), i);
                }
            }
            let f;
            if (fields.has('id')) {
                f = fields.get('id');
            }
            else if (!f && fields.has('_id')) {
                f = fields.get('_id');
            }
            else {
                f = new field_1.Field(Object.assign({}, definitions_1.DEFAULT_ID_FIELD, { entity: result.name }));
                fields.set(f.name, f);
            }
            if (f) {
                f.makeIdentity();
                indexed.add(f.name);
                identity.add(f.name);
                required.add(f.name);
            }
            result.relations = relations;
            result.identity = identity;
            result.required = required;
            result.indexed = indexed;
            result.fields = fields;
            result.operations = operations;
            this.$obj = result;
        }
    }
    ensureIndexes() {
        this.setMetadata('storage.indexes', {});
        this.fields.forEach(f => {
            if (f.identity) {
                this.updateUniqueIndex(f);
            }
            else if (f.indexed) {
                this.updateIndex(f);
            }
        });
    }
    toObject(modelPackage) {
        if (!modelPackage) {
            let props = this.$obj;
            let res = super.toObject();
            return clean_1.default(Object.assign({}, res, { fields: [...Array.from(props.fields.values())].map(f => f.toObject()), operations: [...Array.from(props.operations.values())].map(f => f.toObject()) }));
        }
        else {
            let modelRelations = modelPackage.relations.get(this.name);
            if (modelRelations) {
                let props = this.$obj;
                let res = super.toObject();
                return clean_1.default(Object.assign({}, res, { operations: [...Array.from(props.operations.values())], fields: [...Array.from(props.fields.values())]
                        .map(f => {
                        let result;
                        if (this.relations.has(f.name)) {
                            if (modelRelations && modelRelations.has(f.name)) {
                                result = f.toObject(modelPackage);
                            }
                        }
                        else {
                            result = f.toObject(modelPackage);
                        }
                        return result;
                    })
                        .filter(f => f) }));
            }
        }
    }
    toJSON(modelPackage) {
        if (!modelPackage) {
            let props = this.$obj;
            let res = super.toJSON();
            return clean_1.default(Object.assign({}, res, { fields: [...Array.from(props.fields.values())], operations: [...Array.from(props.operations.values())] }));
        }
        else {
            let modelRelations = modelPackage.relations.get(this.name);
            if (modelRelations) {
                let props = this.$obj;
                let res = super.toJSON();
                return clean_1.default(Object.assign({}, res, { fields: [...Array.from(props.fields.values())]
                        .map(f => {
                        let result;
                        if (this.relations.has(f.name)) {
                            if (modelRelations && modelRelations.has(f.name)) {
                                result = f.toJSON(modelPackage);
                            }
                        }
                        else {
                            result = f.toJSON(modelPackage);
                        }
                        return result;
                    })
                        .filter(f => f), operations: [...Array.from(props.operations.values())] }));
            }
        }
    }
}
exports.EntityBase = EntityBase;
//# sourceMappingURL=entitybase.js.map