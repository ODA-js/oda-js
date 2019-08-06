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
const deepMerge_1 = __importDefault(require("../lib/deepMerge"));
const fillDefaults_1 = __importDefault(require("../lib/fillDefaults"));
const jsonUtils = __importStar(require("../lib"));
const invariant_1 = __importDefault(require("invariant"));
const warning_1 = __importDefault(require("warning"));
const immutable_1 = require("immutable");
const hashToString = entry => entry
    ? Object.keys(entry).reduce((result, curr) => {
        if (curr) {
            if (Array.isArray(entry[curr])) {
                result.push(...entry[curr]);
            }
            else if (typeof entry[curr] == 'string') {
                result.push(entry[curr]);
            }
            else {
                result.push(...hashToString(entry[curr]));
            }
        }
        return result;
    }, [])
    : [];
class GQLModule {
    get name() {
        if (!this._name && !(this.constructor && this.constructor.name)) {
            invariant_1.default(this._name, 'module has no name neither _name nor constructor.name to be initialized');
            console.trace();
        }
        if (!this._name && this.constructor && this.constructor.name) {
            warning_1.default(this._name, `module ${this.constructor.name} has no name to be initialized, only constructor.name, it may drive to schema build fail in minified code`);
            console.trace();
        }
        return this._name || this.constructor.name;
    }
    get resolver() {
        return this._resolver || {};
    }
    get query() {
        return this._query || {};
    }
    get viewer() {
        return this._viewer || {};
    }
    get mutation() {
        return this._mutation || {};
    }
    get subscription() {
        return this._subscription || {};
    }
    get typeDef() {
        return hashToString(this._typeDef);
    }
    get mutationEntry() {
        return hashToString(this._mutationEntry);
    }
    get subscriptionEntry() {
        return hashToString(this._subscriptionEntry);
    }
    get queryEntry() {
        return hashToString(this._queryEntry);
    }
    get viewerEntry() {
        return hashToString(this._viewerEntry);
    }
    get hooks() {
        return this._hooks || [];
    }
    applyHooks(obj) {
        let modelHooks = this.hooks;
        for (let i = 0, len = modelHooks.length; i < len; i++) {
            let hookList = Object.keys(modelHooks[i]);
            for (let j = 0, jLen = hookList.length; j < jLen; j++) {
                let key = hookList[j];
                jsonUtils.set(obj, key, modelHooks[i][key](jsonUtils.get(obj, key)));
            }
        }
        return obj;
    }
    constructor({ name, resolver, query, viewer, typeDef, mutationEntry, subscriptionEntry, queryEntry, viewerEntry, mutation, subscription, hooks, extend, composite, }) {
        if (name !== undefined) {
            this._name = name;
        }
        if (resolver !== undefined) {
            this._resolver = resolver;
        }
        if (query !== undefined) {
            this._query = query;
        }
        if (viewer !== undefined) {
            this._viewer = viewer;
        }
        if (mutation !== undefined) {
            this._mutation = mutation;
        }
        if (subscription !== undefined) {
            this._subscription = subscription;
        }
        if (typeDef !== undefined) {
            this._typeDef = typeDef;
        }
        if (mutationEntry !== undefined) {
            this._mutationEntry = mutationEntry;
        }
        if (subscriptionEntry !== undefined) {
            this._subscriptionEntry = subscriptionEntry;
        }
        if (queryEntry !== undefined) {
            this._queryEntry = queryEntry;
        }
        if (viewerEntry !== undefined) {
            this._viewerEntry = viewerEntry;
        }
        if (hooks !== undefined) {
            this._hooks = hooks;
        }
        if (extend !== undefined) {
            this._extend = extend;
        }
        if (composite !== undefined) {
            this._composite = composite;
        }
    }
    discoverExtendsOf(extendees) {
        if (this._extend && this._extend.length > 0) {
            this._extend.forEach(e => {
                extendees = e.discoverExtendsOf(extendees);
                if (!extendees.has(e.name)) {
                    extendees = extendees.set(e.name, e);
                }
                else {
                    let original = extendees.get(e.name);
                    if (original !== e) {
                        original.override(e);
                    }
                }
            });
        }
        return extendees;
    }
    discoverCompositeOf(composees) {
        if (this._composite && this._composite.length > 0) {
            this._composite.forEach(e => {
                composees = e.discoverCompositeOf(composees);
                if (!composees.has(e.name)) {
                    composees = composees.set(e.name, e);
                }
                else {
                    let original = composees.get(e.name);
                    if (original !== e) {
                        original.override(e);
                    }
                }
            });
        }
        return composees;
    }
    build() {
        if (!this._extendsOf) {
            this._extendsOf = immutable_1.OrderedMap();
        }
        else {
            this._extendsOf = this._extendsOf.clear();
        }
        if (!this._compositeOf) {
            this._compositeOf = immutable_1.OrderedMap();
        }
        else {
            this._compositeOf = this._compositeOf.clear();
        }
        this._extendsOf = this.discoverExtendsOf(this._extendsOf);
        this.extend(Array.from(this._extendsOf.values()));
        this._compositeOf = this.discoverCompositeOf(this._compositeOf);
        this.compose(Array.from(this._compositeOf.values()));
    }
    compose(obj) {
        if (Array.isArray(obj)) {
            for (let i = 0, len = obj.length; i < len; i++) {
                this.compose(obj[i]);
            }
        }
        else {
            if (obj._resolver !== undefined) {
                this._resolver = deepMerge_1.default(this._resolver, obj._resolver);
            }
            if (obj._query !== undefined) {
                this._query = deepMerge_1.default(this._query, obj._query);
            }
            if (obj._viewer !== undefined) {
                this._viewer = deepMerge_1.default(this._viewer, obj._viewer);
            }
            if (obj._mutation !== undefined) {
                this._mutation = deepMerge_1.default(this._mutation, obj._mutation);
            }
            if (obj._subscription !== undefined) {
                this._subscription = deepMerge_1.default(this._subscription, obj._subscription);
            }
            if (obj._typeDef !== undefined) {
                this._typeDef = deepMerge_1.default(this._typeDef, obj._typeDef);
            }
            if (obj._mutationEntry !== undefined) {
                this._mutationEntry = deepMerge_1.default(this._mutationEntry, obj._mutationEntry);
            }
            if (obj._subscriptionEntry !== undefined) {
                this._subscriptionEntry = deepMerge_1.default(this._subscriptionEntry, obj._subscriptionEntry);
            }
            if (obj._queryEntry !== undefined) {
                this._queryEntry = deepMerge_1.default(this._queryEntry, obj._queryEntry);
            }
            if (obj._viewerEntry !== undefined) {
                this._viewerEntry = deepMerge_1.default(this._viewerEntry, obj._viewerEntry);
            }
            if (obj._hooks !== undefined) {
                this._hooks = [...(this._hooks || []), ...(obj._hooks || [])];
            }
        }
    }
    extend(obj) {
        if (Array.isArray(obj)) {
            for (let i = 0, len = obj.length; i < len; i++) {
                this.extend(obj[i]);
            }
        }
        else {
            if (obj._resolver !== undefined) {
                this._resolver = fillDefaults_1.default(obj._resolver, this._resolver);
            }
            if (obj._query !== undefined) {
                this._query = fillDefaults_1.default(obj._query, this._query);
            }
            if (obj._viewer !== undefined) {
                this._viewer = fillDefaults_1.default(obj._viewer, this._viewer);
            }
            if (obj._mutation !== undefined) {
                this._mutation = fillDefaults_1.default(obj._mutation, this._mutation);
            }
            if (obj._subscription !== undefined) {
                this._subscription = fillDefaults_1.default(obj._subscription, this._subscription);
            }
            if (obj._typeDef !== undefined) {
                this._typeDef = fillDefaults_1.default(obj._typeDef, this._typeDef);
            }
            if (obj._mutationEntry !== undefined) {
                this._mutationEntry = fillDefaults_1.default(obj._mutationEntry, this._mutationEntry);
            }
            if (obj._subscriptionEntry !== undefined) {
                this._subscriptionEntry = fillDefaults_1.default(obj._subscriptionEntry, this._subscriptionEntry);
            }
            if (obj._queryEntry !== undefined) {
                this._queryEntry = fillDefaults_1.default(obj._queryEntry, this._queryEntry);
            }
            if (obj._viewerEntry !== undefined) {
                this._viewerEntry = fillDefaults_1.default(obj._viewerEntry, this._viewerEntry);
            }
            if (obj._hooks !== undefined) {
                this._hooks = fillDefaults_1.default(obj._hooks, this._hooks);
            }
        }
    }
    override(obj) {
        if (Array.isArray(obj)) {
            for (let i = 0, len = obj.length; i < len; i++) {
                this.override(obj[i]);
            }
        }
        else {
            if (obj._resolver !== undefined) {
                this._resolver = fillDefaults_1.default(this._resolver, obj._resolver);
            }
            if (obj._query !== undefined) {
                this._query = fillDefaults_1.default(this._query, obj._query);
            }
            if (obj._viewer !== undefined) {
                this._viewer = fillDefaults_1.default(this._viewer, obj._viewer);
            }
            if (obj._mutation !== undefined) {
                this._mutation = fillDefaults_1.default(this._mutation, obj._mutation);
            }
            if (obj._subscription !== undefined) {
                this._subscription = fillDefaults_1.default(this._subscription, obj._subscription);
            }
            if (obj._typeDef !== undefined) {
                this._typeDef = fillDefaults_1.default(this._typeDef, obj._typeDef);
            }
            if (obj._mutationEntry !== undefined) {
                this._mutationEntry = fillDefaults_1.default(this._mutationEntry, obj._mutationEntry);
            }
            if (obj._subscriptionEntry !== undefined) {
                this._subscriptionEntry = fillDefaults_1.default(this._subscriptionEntry, obj._subscriptionEntry);
            }
            if (obj._queryEntry !== undefined) {
                this._queryEntry = fillDefaults_1.default(this._queryEntry, obj._queryEntry);
            }
            if (obj._viewerEntry !== undefined) {
                this._viewerEntry = fillDefaults_1.default(this._viewerEntry, obj._viewerEntry);
            }
            if (obj._hooks !== undefined) {
                this._hooks = fillDefaults_1.default(this._hooks, obj._hooks);
            }
        }
    }
}
exports.GQLModule = GQLModule;
//# sourceMappingURL=empty.js.map