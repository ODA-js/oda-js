"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../interfaces");
const visitors_1 = require("./visitors");
class Validator {
    constructor() {
        this.errors = [];
        this.rules = {};
    }
    registerRule(modelType, rule) {
        if (!this.rules[modelType]) {
            this.rules[modelType] = [];
        }
        this.rules[modelType].push(...rule);
    }
    getRules(modelType) {
        return this.rules[modelType] || [];
    }
    check(item, options) {
        let walker;
        if (interfaces_1.isModel(item)) {
            return new visitors_1.ModelVisitor(this).visit(item);
        }
        if (interfaces_1.isPackage(item)) {
            return new visitors_1.PackageVisitor(this).visit(item);
        }
        if (interfaces_1.isEntity(item) && options && options.package) {
            return new visitors_1.EntityVisitor(this, options.package).visit(item);
        }
        if (interfaces_1.isField(item) && options && options.entity) {
            return new visitors_1.FieldVisitor(this, options.entity).visit(item);
        }
        if (interfaces_1.isRelation(item) && options && options.field) {
            return new visitors_1.RelationVisitor(this, options.field).visit(item);
        }
        return [];
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map