"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const deepMerge_1 = __importDefault(require("../lib/json/deepMerge"));
const fold_1 = __importDefault(require("../lib/json/fold"));
const entity_1 = require("./entity");
const modelpackage_1 = require("./modelpackage");
const mutation_1 = require("./mutation");
const query_1 = require("./query");
const mixin_1 = require("./mixin");
const union_1 = require("./union");
const enum_1 = require("./enum");
const scalar_1 = require("./scalar");
const directive_1 = require("./directive");
function getFilter(inp) {
    let result = {
        filter: f => f.name === inp,
        fields: [inp],
    };
    if (inp === '*') {
        result.filter = () => true;
    }
    if (inp.startsWith('^[')) {
        let notFields = inp
            .slice(2, inp.length - 1)
            .split(',')
            .map(f => f.trim())
            .reduce((res, cur) => {
            res[cur] = 1;
            return res;
        }, {});
        result.filter = f => !notFields[f.name];
        result.fields = [];
    }
    if (inp.startsWith('[')) {
        let onlyFields = inp
            .slice(1, inp.length - 1)
            .split(',')
            .map(f => f.trim())
            .reduce((res, cur) => {
            res[cur] = 1;
            return res;
        }, {});
        result.filter = f => !!onlyFields[f.name];
        result.fields = Object.keys(onlyFields);
    }
    return result;
}
class MetaModel extends modelpackage_1.ModelPackage {
    constructor(name = 'default') {
        super({ name });
        this.modelType = 'model';
        this.packages = new Map();
        this.store = 'default.json';
        this.ensureDefaultPackage();
    }
    validate(validator) {
        return validator.check(this);
    }
    loadModel(fileName = this.store) {
        let txt = fs_1.default.readFileSync(fileName);
        let store = JSON.parse(txt.toString());
        this.loadPackage(store);
    }
    dedupeFields(src) {
        return src.reduce((res, curr) => {
            if (!res.hasOwnProperty(curr.name)) {
                res[curr.name] = curr;
            }
            else {
                res[curr.name] = deepMerge_1.default(res[curr.name], curr);
            }
            return res;
        }, {});
    }
    applyEntityHook(entity, hook) {
        let result = entity.toJSON();
        let metadata;
        if (hook.metadata) {
            metadata = deepMerge_1.default(result.metadata || {}, hook.metadata);
        }
        let fields;
        if (hook.fields) {
            if (Array.isArray(hook.fields)) {
                fields = this.dedupeFields([
                    ...result.fields,
                    ...hook.fields,
                ]);
            }
            else {
                fields = this.dedupeFields(result.fields);
                let fNames = Object.keys(hook.fields);
                for (let i = 0, len = fNames.length; i < len; i++) {
                    let fName = fNames[i];
                    let prepare = getFilter(fName);
                    let list = result.fields.filter(prepare.filter);
                    if (list.length > 0) {
                        list.forEach(f => {
                            fields[f.name] = deepMerge_1.default(f, hook.fields[fName]);
                        });
                    }
                    else {
                        prepare.fields.forEach(f => {
                            fields[f] = hook.fields[fName];
                        });
                    }
                }
            }
        }
        return new entity_1.Entity(Object.assign({}, result, { fields,
            metadata }));
    }
    applyMutationHook(mutation, hook) {
        let result = mutation.toJSON();
        let metadata;
        if (hook.metadata) {
            metadata = deepMerge_1.default(result.metadata || {}, hook.metadata);
        }
        let args = result.args, payload = result.payload;
        if (hook.args) {
            args = [...args, ...hook.args];
        }
        if (hook.payload) {
            payload = [...payload, ...hook.payload];
        }
        result = Object.assign({}, result, { args,
            payload,
            metadata });
        return new mutation_1.Mutation(result);
    }
    applyQueryHook(mutation, hook) {
        let result = mutation.toJSON();
        let metadata;
        if (hook.metadata) {
            metadata = deepMerge_1.default(result.metadata || {}, hook.metadata);
        }
        let args = result.args, payload = result.payload;
        if (hook.args) {
            args = [...args, ...hook.args];
        }
        if (hook.payload) {
            payload = [...payload, ...hook.payload];
        }
        result = Object.assign({}, result, { args,
            payload,
            metadata });
        return new query_1.Query(result);
    }
    applyHooks(hooks) {
        if (hooks && !Array.isArray(hooks)) {
            hooks = [hooks];
        }
        if (hooks) {
            hooks = hooks.filter(f => f);
            hooks.forEach(hook => {
                if (hook.entities && this.entities.size > 0) {
                    let keys = Object.keys(hook.entities);
                    for (let i = 0, len = keys.length; i < len; i++) {
                        let key = keys[i];
                        let current = hook.entities[key];
                        current.fields = current.fields ? current.fields : [];
                        current.metadata = current.metadata ? current.metadata : {};
                        let prepare = getFilter(key);
                        let list = Array.from(this.entities.values()).filter(prepare.filter);
                        if (list.length > 0) {
                            list.forEach(e => {
                                let result = this.applyEntityHook(e, current);
                                this.entities.set(result.name, result);
                            });
                        }
                        else if (prepare.fields.length > 0) {
                            throw new Error(`Entit${prepare.fields.length === 1 ? 'y' : 'ies'} ${prepare.fields} not found`);
                        }
                    }
                }
                if (hook.mutations && this.mutations.size > 0) {
                    let keys = Object.keys(hook.mutations);
                    for (let i = 0, len = keys.length; i < len; i++) {
                        let key = keys[i];
                        let current = hook.mutations[key];
                        current.args = current.args ? current.args : [];
                        current.payload = current.payload ? current.payload : [];
                        current.metadata = current.metadata ? current.metadata : {};
                        let prepare = getFilter(key);
                        let list = Array.from(this.mutations.values()).filter(prepare.filter);
                        if (list.length > 0) {
                            list.forEach(e => {
                                let result = this.applyMutationHook(e, current);
                                this.mutations.set(result.name, result);
                            });
                        }
                        else if (prepare.fields.length > 0) {
                            throw new Error(`Mutation${prepare.fields.length > 1 ? 's' : ''} ${prepare.fields} not found`);
                        }
                    }
                }
                if (hook.queries && this.queries.size > 0) {
                    let keys = Object.keys(hook.queries);
                    for (let i = 0, len = keys.length; i < len; i++) {
                        let key = keys[i];
                        let current = hook.queries[key];
                        current.args = current.args ? current.args : [];
                        current.payload = current.payload ? current.payload : [];
                        current.metadata = current.metadata ? current.metadata : {};
                        let prepare = getFilter(key);
                        let list = Array.from(this.queries.values()).filter(prepare.filter);
                        if (list.length > 0) {
                            list.forEach(e => {
                                let result = this.applyQueryHook(e, current);
                                this.queries.set(result.name, result);
                            });
                        }
                        else if (prepare.fields.length > 0) {
                            throw new Error(`Quer${prepare.fields.length > 1 ? 'ies' : 'y'} ${prepare.fields} not found`);
                        }
                    }
                }
            });
        }
    }
    addPackage(pckg) {
        let pack;
        if (pckg.name && this.packages.has(pckg.name)) {
            pack = this.packages.get(pckg.name);
        }
        else {
            pack = new modelpackage_1.ModelPackage(pckg);
            pack.connect(this);
            this.packages.set(pckg.name, pack);
        }
        if (pckg.mixins) {
            pckg.mixins.forEach(e => {
                if (this.mixins.has(e) && !pack.mixins.has(e)) {
                    pack.addMixin(this.mixins.get(e));
                }
            });
        }
        if (pckg.entities) {
            pckg.entities.forEach(e => {
                if (this.entities.has(e) && !pack.entities.has(e)) {
                    pack.addEntity(this.entities.get(e));
                }
            });
        }
        if (pckg.mutations) {
            pckg.mutations.forEach(m => {
                if (this.mutations.has(m) && !pack.mutations.has(m)) {
                    pack.addMutation(this.mutations.get(m));
                }
            });
        }
        if (pckg.queries) {
            pckg.queries.forEach(e => {
                if (this.queries.has(e) && !pack.queries.has(e)) {
                    pack.addQuery(this.queries.get(e));
                }
            });
        }
        if (pckg.enums) {
            pckg.enums.forEach(e => {
                if (this.enums.has(e) && !pack.enums.has(e)) {
                    pack.addEnum(this.enums.get(e));
                }
            });
        }
        if (pckg.scalars) {
            pckg.scalars.forEach(e => {
                if (this.scalars.has(e) && !pack.scalars.has(e)) {
                    pack.addScalar(this.scalars.get(e));
                }
            });
        }
        if (pckg.directives) {
            pckg.directives.forEach(e => {
                if (this.directives.has(e) && !pack.directives.has(e)) {
                    pack.addDirective(this.directives.get(e));
                }
            });
        }
        if (pckg.unions) {
            pckg.unions.forEach(e => {
                if (this.unions.has(e) && !pack.unions.has(e)) {
                    pack.addUnion(this.unions.get(e));
                }
            });
        }
        pack.ensureAll();
    }
    loadPackage(store, hooks) {
        this.reset();
        if (store.mixins) {
            store.mixins.forEach(q => {
                this.addMixin(new mixin_1.Mixin(q));
            });
        }
        if (store.entities) {
            store.entities.forEach(ent => {
                this.addEntity(new entity_1.Entity(ent));
            });
        }
        if (store.mutations) {
            store.mutations.forEach(mut => {
                this.addMutation(new mutation_1.Mutation(mut));
            });
        }
        if (store.queries) {
            store.queries.forEach(q => {
                this.addQuery(new query_1.Query(q));
            });
        }
        if (store.enums) {
            store.enums.forEach(q => {
                this.addEnum(new enum_1.Enum(q));
            });
        }
        if (store.scalars) {
            store.scalars.forEach(q => {
                this.addScalar(new scalar_1.Scalar(q));
            });
        }
        if (store.directives) {
            store.directives.forEach(q => {
                this.addDirective(new directive_1.Directive(q));
            });
        }
        if (store.unions) {
            store.unions.forEach(q => {
                this.addUnion(new union_1.Union(q));
            });
        }
        this.ensureDefaultPackage();
        this.applyHooks(fold_1.default(hooks));
        if (Array.isArray(store.packages)) {
            store.packages.forEach(this.addPackage.bind(this));
        }
    }
    saveModel(fileName = this.store) {
        fs_1.default.writeFileSync(fileName, JSON.stringify({
            entities: Array.from(this.entities.values()).map(f => f.toJSON()),
            packages: Array.from(this.packages.values())
                .map(f => f.toJSON()),
            mutations: Array.from(this.mutations.values()).map(f => f.toJSON()),
            queries: Array.from(this.queries.values()).map(f => f.toJSON()),
            enums: Array.from(this.enums.values()).map(f => f.toJSON()),
            unions: Array.from(this.unions.values()).map(f => f.toJSON()),
            mixins: Array.from(this.mixins.values()).map(f => f.toJSON()),
            scalars: Array.from(this.scalars.values()).map(f => f.toJSON()),
            directives: Array.from(this.directives.values()).map(f => f.toJSON()),
        }));
    }
    reset() {
        this.entities.clear();
        this.packages.clear();
        this.mutations.clear();
        this.queries.clear();
        this.enums.clear();
        this.mixins.clear();
        this.unions.clear();
        this.scalars.clear();
        this.directives.clear();
    }
    createPackage(name) {
        if (this.packages.has(name)) {
            throw new Error(`Package "${name}" already exists`);
        }
        let pack = new modelpackage_1.ModelPackage({ name });
        this.packages.set(name, pack);
        pack.connect(this);
        return pack;
    }
    assignEntityToPackage(input) {
        let pack = this.packages.get(input.package);
        if (!pack) {
            throw new Error(`Package ${input.package} didn't exists`);
        }
        let ent = this.entities.get(input.entity);
        if (!ent) {
            throw new Error(`Package ${input.entity} didn't exists`);
        }
        pack.addEntity(ent);
        pack.ensureAll();
        return {
            package: pack,
            entity: ent,
        };
    }
    ensureDefaultPackage() {
        if (!this.packages.has(this.name)) {
            this.defaultPackage = this;
            this.connect(this);
            this.ensureAll();
            this.packages.set(this.name, this);
        }
    }
}
exports.MetaModel = MetaModel;
//# sourceMappingURL=metamodel.js.map