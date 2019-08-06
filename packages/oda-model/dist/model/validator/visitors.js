"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contexts_1 = require("./contexts");
class ModelVisitor {
    visit(model) {
        const context = new contexts_1.ModelContext(model);
        const result = [];
        if (context.isValid) {
            let done = false;
            while (!done) {
                try {
                    const rules = this.validator.getRules('model');
                    rules.forEach(rule => result.push(...rule.validate(context)));
                    Array.from(model.packages.values())
                        .filter(p => p.name !== model.name)
                        .forEach(p => {
                        result.push(...this.validator.check(p, { model: context }));
                    });
                    done = true;
                }
                catch (err) {
                    if (!(err instanceof contexts_1.RestartLevelError)) {
                        throw err;
                    }
                }
            }
        }
        else {
            result.push({
                model: context.model.name,
                message: 'Validation context invalid',
                result: 'error',
            });
        }
        return result.map(r => (Object.assign({}, r, { model: context.model.name })));
    }
    constructor(validator) {
        this.validator = validator;
    }
}
exports.ModelVisitor = ModelVisitor;
class PackageVisitor {
    visit(item) {
        if (!this.context) {
            this.context = new contexts_1.ModelContext(item.metaModel);
        }
        const context = new contexts_1.PackageContext(this.context, item);
        const result = [];
        if (context.isValid) {
            let done = false;
            while (!done) {
                try {
                    const rules = this.validator.getRules('package');
                    rules.forEach(rule => result.push(...rule.validate(context)));
                    item.entities.forEach(p => {
                        result.push(...this.validator.check(p, { package: context }));
                    });
                    done = true;
                }
                catch (err) {
                    if (!(err instanceof contexts_1.PackageLevel)) {
                        throw err;
                    }
                }
            }
        }
        else {
            result.push({
                package: context.package.name,
                message: 'Validation context invalid',
                result: 'error',
            });
        }
        return result.map(r => (Object.assign({}, r, { package: context.package.name })));
    }
    constructor(validator, model) {
        this.validator = validator;
        this.context = model;
    }
}
exports.PackageVisitor = PackageVisitor;
class EntityVisitor {
    visit(item) {
        const context = new contexts_1.EntityContext(this.context, item);
        const result = [];
        if (context.isValid) {
            let done = false;
            while (!done) {
                try {
                    const rules = this.validator.getRules('entity');
                    rules.forEach(rule => result.push(...rule.validate(context)));
                    const fields = [...item.fields.values()];
                    fields
                        .filter(f => {
                        let read = f.getMetadata('acl.read');
                        if (typeof read === 'string') {
                            read = [read];
                        }
                        if (read && read.length > 0) {
                            if (read.indexOf(context.package.name) > -1) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            return true;
                        }
                    })
                        .forEach(p => {
                        result.push(...this.validator.check(p, { entity: context }));
                    });
                    done = true;
                }
                catch (err) {
                    if (!(err instanceof contexts_1.EntityLevel)) {
                        throw err;
                    }
                }
            }
        }
        else {
            result.push({
                entity: context.entity.name,
                message: 'Validation context invalid',
                result: 'error',
            });
        }
        return result.map(r => (Object.assign({}, r, { entity: context.entity.name })));
    }
    constructor(validator, pkg) {
        this.validator = validator;
        this.context = pkg;
    }
}
exports.EntityVisitor = EntityVisitor;
class FieldVisitor {
    visit(item) {
        const context = new contexts_1.FieldContext(this.context, item);
        const result = [];
        if (context.isValid) {
            let done = false;
            while (!done) {
                try {
                    const rules = this.validator.getRules('field');
                    rules.forEach(rule => result.push(...rule.validate(context)));
                    if (item.relation) {
                        result.push(...this.validator.check(item.relation, { field: context }));
                    }
                    done = true;
                }
                catch (err) {
                    if (!(err instanceof contexts_1.FieldLevel)) {
                        throw err;
                    }
                }
            }
        }
        else {
            result.push({
                message: 'Validation context invalid',
                result: 'error',
            });
        }
        return result.map(r => (Object.assign({}, r, { field: context.field.name })));
    }
    constructor(validator, pkg) {
        this.validator = validator;
        this.context = pkg;
    }
}
exports.FieldVisitor = FieldVisitor;
class RelationVisitor {
    visit(item) {
        const context = new contexts_1.RelationContext(this.context, item);
        const result = [];
        if (context.isValid) {
            let done = false;
            while (!done) {
                try {
                    const rules = this.validator.getRules('relation');
                    rules.forEach(rule => result.push(...rule.validate(context)));
                    switch (item.verb) {
                        case 'BelongsTo': {
                            const belongsTo = this.validator.getRules('BelongsTo');
                            belongsTo.forEach(rule => result.push(...rule.validate(context)));
                            break;
                        }
                        case 'BelongsToMany': {
                            const belongsToMany = this.validator.getRules('BelongsToMany');
                            belongsToMany.forEach(rule => result.push(...rule.validate(context)));
                            break;
                        }
                        case 'HasOne': {
                            const hasOne = this.validator.getRules('HasOne');
                            hasOne.forEach(rule => result.push(...rule.validate(context)));
                            break;
                        }
                        case 'HasMany': {
                            const hasMany = this.validator.getRules('HasMany');
                            hasMany.forEach(rule => result.push(...rule.validate(context)));
                            break;
                        }
                        default:
                    }
                    done = true;
                }
                catch (err) {
                    if (!(err instanceof contexts_1.RelationLevel)) {
                        throw err;
                    }
                }
            }
        }
        else {
            result.push({
                message: 'Validation context invalid',
                result: 'error',
            });
        }
        return result;
    }
    constructor(validator, pkg) {
        this.validator = validator;
        this.context = pkg;
    }
}
exports.RelationVisitor = RelationVisitor;
//# sourceMappingURL=visitors.js.map