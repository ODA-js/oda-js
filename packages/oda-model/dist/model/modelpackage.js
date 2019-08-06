"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const entity_1 = require("./entity");
const lodash_1 = require("lodash");
const mutation_1 = require("./mutation");
const query_1 = require("./query");
const union_1 = require("./union");
const enum_1 = require("./enum");
const scalar_1 = require("./scalar");
const directive_1 = require("./directive");
const metadata_1 = require("./metadata");
const defaultPackage = {
    metadata: {
        acl: {
            read: true,
            create: true,
            update: true,
            delete: true,
            subscribe: true,
            type: false,
            relations: true,
        },
    },
};
class ModelPackage extends metadata_1.Metadata {
    constructor(input) {
        super(input ? lodash_1.merge({}, input, defaultPackage) : defaultPackage);
        this.modelType = 'package';
        this.abstract = false;
        this.entities = new Map();
        this.scalars = new Map();
        this.directives = new Map();
        this.mixins = new Map();
        this.unions = new Map();
        this.enums = new Map();
        this.identityFields = new Map();
        this.relations = new Map();
        this.mutations = new Map();
        this.queries = new Map();
        if (!input) {
            this.name = 'DefaultPackage';
        }
        else {
            this.name = input.name;
            this.title = input.title;
            this.description = input.description;
            this.abstract = input.abstract;
        }
    }
    validate(validator) {
        return validator.check(this);
    }
    connect(metaModel) {
        this.metaModel = metaModel;
    }
    addEntity(entity) {
        if (entity instanceof entity_1.Entity) {
            this.entities.set(entity.name, entity);
            entity.ensureIds(this);
        }
        this.ensureEntity(entity);
        return entity;
    }
    addMutation(mutation) {
        if (mutation instanceof mutation_1.Mutation) {
            this.mutations.set(mutation.name, mutation);
        }
        this.ensureMutation(mutation);
        return mutation;
    }
    addQuery(query) {
        if (query instanceof query_1.Query) {
            this.queries.set(query.name, query);
        }
        this.ensureQuery(query);
        return query;
    }
    addUnion(uni) {
        if (uni instanceof union_1.Union) {
            this.unions.set(uni.name, uni);
        }
        this.ensureUnion(uni);
        return uni;
    }
    addEnum(enu) {
        if (enu instanceof enum_1.Enum) {
            this.enums.set(enu.name, enu);
        }
        this.ensureEnum(enu);
        return enu;
    }
    addMixin(mix) {
        if (mix instanceof query_1.Query) {
            this.mixins.set(mix.name, mix);
        }
        this.ensureMixin(mix);
        return mix;
    }
    addScalar(scalar) {
        if (scalar instanceof scalar_1.Scalar) {
            this.scalars.set(scalar.name, scalar);
        }
        this.ensureScalar(scalar);
        return scalar;
    }
    addDirective(directive) {
        if (directive instanceof directive_1.Directive) {
            this.directives.set(directive.name, directive);
        }
        this.ensureDirective(directive);
        return directive;
    }
    get(name) {
        return this.entities.get(name);
    }
    create(json) {
        return this.addEntity(new entity_1.Entity(json));
    }
    remove(name) {
        let entity = this.entities.get(name);
        if (entity) {
            this.entities.delete(name);
            entity.removeIds(this);
        }
    }
    get size() {
        return this.entities.size;
    }
    ensureAll() {
        this.entities.forEach(e => {
            e.ensureImplementation(this);
            e.ensureFKs(this);
        });
    }
    toJSON() {
        return clean_1.default({
            name: this.name,
            title: this.title,
            abstract: this.abstract,
            description: this.description,
            entities: Array.from(this.entities.values()).map(f => f.name),
            mutations: Array.from(this.mutations.values()).map(f => f.name),
            queries: Array.from(this.queries.values()).map(f => f.name),
            directives: Array.from(this.directives.values()).map(f => f.name),
            enums: Array.from(this.enums.values()).map(f => f.name),
            unions: Array.from(this.unions.values()).map(f => f.name),
            mixins: Array.from(this.mixins.values()).map(f => f.name),
        });
    }
    toObject() {
        return clean_1.default({
            name: this.name,
            title: this.title,
            description: this.description,
            abstract: this.abstract,
            entities: Array.from(this.entities.values()).map(f => f.toObject(this)),
            mutations: Array.from(this.mutations.values()).map(f => f.toObject()),
            queries: Array.from(this.queries.values()).map(f => f.toObject()),
            directives: Array.from(this.directives.values()).map(f => f.toObject()),
            enums: Array.from(this.enums.values()).map(f => f.toObject()),
            unions: Array.from(this.unions.values()).map(f => f.toObject()),
            mixins: Array.from(this.mixins.values()).map(f => f.toObject(this)),
        });
    }
    ensureEntity(entity) {
        if (!this.metaModel.entities.has(entity.name)) {
            this.metaModel.entities.set(entity.name, entity);
        }
    }
    ensureMutation(mutation) {
        if (!this.metaModel.mutations.has(mutation.name)) {
            this.metaModel.mutations.set(mutation.name, mutation);
        }
    }
    ensureQuery(query) {
        if (!this.metaModel.queries.has(query.name)) {
            this.metaModel.queries.set(query.name, query);
        }
    }
    ensureMixin(mixin) {
        if (!this.metaModel.mixins.has(mixin.name)) {
            this.metaModel.mixins.set(mixin.name, mixin);
        }
    }
    ensureScalar(scalar) {
        if (!this.metaModel.scalars.has(scalar.name)) {
            this.metaModel.scalars.set(scalar.name, scalar);
        }
    }
    ensureDirective(directive) {
        if (!this.metaModel.directives.has(directive.name)) {
            this.metaModel.directives.set(directive.name, directive);
        }
    }
    ensureUnion(uni) {
        if (!this.metaModel.unions.has(uni.name)) {
            this.metaModel.unions.set(uni.name, uni);
        }
    }
    ensureEnum(enu) {
        if (!this.metaModel.enums.has(enu.name)) {
            this.metaModel.enums.set(enu.name, enu);
        }
    }
}
exports.ModelPackage = ModelPackage;
//# sourceMappingURL=modelpackage.js.map