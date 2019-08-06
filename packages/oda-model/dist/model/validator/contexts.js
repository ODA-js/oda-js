"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RestartLevelError extends Error {
}
exports.RestartLevelError = RestartLevelError;
class ModelLevel extends RestartLevelError {
}
exports.ModelLevel = ModelLevel;
class PackageLevel extends RestartLevelError {
}
exports.PackageLevel = PackageLevel;
class EntityLevel extends RestartLevelError {
}
exports.EntityLevel = EntityLevel;
class FieldLevel extends RestartLevelError {
}
exports.FieldLevel = FieldLevel;
class RelationLevel extends RestartLevelError {
}
exports.RelationLevel = RelationLevel;
function restart(type) {
    switch (type) {
        case 'model':
            throw new ModelLevel();
        case 'package':
            throw new PackageLevel();
        case 'entity':
            throw new EntityLevel();
        case 'field':
            throw new FieldLevel();
        case 'relation':
            throw new RelationLevel();
        default:
            throw Error('unknown restart level');
    }
}
exports.restart = restart;
class ModelContext {
    constructor(model) {
        this.model = model;
        this.errors = [];
    }
    get isValid() {
        return !!this.model;
    }
    restart(level) {
        restart('model');
    }
}
exports.ModelContext = ModelContext;
class PackageContext {
    constructor(context, pkg) {
        this.model = context.model;
        this.package = pkg;
        this.errors = [];
    }
    get isValid() {
        return !!(this.model && this.package);
    }
    restart(level) {
        restart('package');
    }
}
exports.PackageContext = PackageContext;
class EntityContext {
    constructor(context, entity) {
        this.model = context.model;
        this.package = context.package;
        this.entity = entity;
        this.errors = [];
    }
    get isValid() {
        return !!(this.model && this.package && this.entity);
    }
    restart(level) {
        restart('entity');
    }
}
exports.EntityContext = EntityContext;
class FieldContext {
    constructor(context, field) {
        this.model = context.model;
        this.package = context.package;
        this.entity = context.entity;
        this.field = field;
    }
    get isValid() {
        return !!(this.model && this.package && this.entity && this.field);
    }
    restart(level) {
        restart('field');
    }
}
exports.FieldContext = FieldContext;
class RelationContext {
    constructor(context, relation) {
        this.model = context.model;
        this.package = context.package;
        this.entity = context.entity;
        this.field = context.field;
        this.relation = relation;
    }
    get isValid() {
        return !!(this.model &&
            this.package &&
            this.entity &&
            this.field &&
            this.relation);
    }
    restart(level) {
        restart('relation');
    }
}
exports.RelationContext = RelationContext;
//# sourceMappingURL=contexts.js.map