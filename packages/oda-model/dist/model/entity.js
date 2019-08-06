"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const entitybase_1 = require("./entitybase");
class Entity extends entitybase_1.EntityBase {
    constructor(obj) {
        super(obj);
        this.modelType = 'entity';
    }
    get implements() {
        return this.$obj.implements;
    }
    get abstract() {
        return !!this.$obj.abstract;
    }
    get embedded() {
        return this.$obj.embedded instanceof Set
            ? Array.from(this.$obj.embedded)
            : this.$obj.embedded;
    }
    ensureImplementation(modelPackage) {
        const newFields = new Map();
        this.implements.forEach(intrf => {
            if (modelPackage.mixins.has(intrf)) {
                const impl = modelPackage.mixins.get(intrf);
                impl.fields.forEach(f => {
                    if (!this.fields.has(f.name)) {
                        newFields.set(f.name, f);
                    }
                });
            }
        });
        if (newFields.size > 0) {
            const update = this.toJSON();
            update.fields.push(...[...newFields.values()].map(f => f.toJSON()));
            this.updateWith(update);
            this.ensureIds(modelPackage);
        }
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            const impl = new Set(obj.implements);
            result.embedded = Array.isArray(obj.embedded)
                ? new Set(obj.embedded)
                : obj.embedded;
            result.abstract = obj.abstract;
            result.implements = impl;
            this.$obj = result;
        }
    }
    toObject(modelPackage) {
        if (!modelPackage) {
            let res = super.toObject();
            return clean_1.default(Object.assign({}, res, { implements: [...this.implements], embedded: this.embedded, abstract: this.abstract }));
        }
        else {
            let modelRelations = modelPackage.relations.get(this.name);
            if (modelRelations) {
                let res = super.toObject();
                return clean_1.default(Object.assign({}, res, { embedded: this.embedded, abstract: this.abstract, implements: [...this.implements].filter(i => modelPackage.mixins.has(i)) }));
            }
        }
    }
    toJSON(modelPackage) {
        if (!modelPackage) {
            let res = super.toJSON();
            return clean_1.default(Object.assign({}, res, { implements: [...this.implements], embedded: this.embedded, abstract: this.abstract }));
        }
        else {
            let modelRelations = modelPackage.relations.get(this.name);
            if (modelRelations) {
                let res = super.toJSON();
                return clean_1.default(Object.assign({}, res, { implements: [...this.implements].filter(i => modelPackage.mixins.has(i)), abstract: this.abstract }));
            }
        }
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map