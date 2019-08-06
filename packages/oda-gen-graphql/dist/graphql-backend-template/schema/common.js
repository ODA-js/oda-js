"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = 'schema/common.ts.njs';
const entityMappers = __importStar(require("./../entity"));
const ensure = __importStar(require("./ensure"));
const queries_1 = require("../queries");
function prepare(entity, pack, role, aclAllow, typeMapper, adapter) {
    return {
        ctx: mapper(entity, pack, role, aclAllow, typeMapper, adapter),
        template: exports.template,
    };
}
exports.prepare = prepare;
function getRels(acl, role, defaults) {
    if (typeof acl === 'boolean') {
        return acl;
    }
    if (acl && typeof acl === 'object') {
        const result = {};
        for (const relName in Object.keys(acl)) {
            const rel = acl[relName];
            if (Array.isArray(rel) || typeof rel === 'string') {
                result[relName] = isIn(rel, role);
            }
            else if (typeof rel === 'object') {
                result[relName] = {
                    query: isIn(rel.query, role),
                    mutate: isIn(rel.mutate, role),
                };
            }
        }
        return result;
    }
    else {
        return defaults;
    }
}
function isIn(source, role) {
    if (typeof source === 'string') {
        return source === role;
    }
    else {
        return source.some(r => r === role);
    }
}
function buildACL(acl, role, defaults) {
    const result = {
        read: (acl && acl.read && isIn(acl.read, role)) || defaults.read,
        create: (acl && acl.create && isIn(acl.create, role)) ||
            defaults.create ||
            defaults.read,
        update: (acl && acl.update && isIn(acl.update, role)) ||
            defaults.update ||
            defaults.read,
        delete: (acl && acl.delete && isIn(acl.delete, role)) ||
            defaults.delete ||
            defaults.read,
        subscribe: (acl && acl.subscribe && isIn(acl.subscribe, role)) ||
            defaults.subscribe ||
            defaults.read,
        type: (acl && acl.type && isIn(acl.type, role)) ||
            defaults.type ||
            defaults.read,
        relations: (acl && acl.relations && acl.relations
            ? getRels(acl.relations, role, defaults.relations)
            : defaults.relations) || defaults.read,
    };
    return result;
}
function expandEntityACL(entity) {
    const result = { relations: {}, fields: {} };
    entity.fields.forEach(field => {
        const acl = field.metadata.acl;
        if (queries_1.fields(field)) {
            result.fields[field.name] = true;
            if (acl) {
                result.fields[field.name] = {};
                if (acl.read) {
                    if (Array.isArray(acl.read)) {
                        result.fields[field.name].query = [...acl.read];
                    }
                    else {
                        result.fields[field.name].query = [acl.read];
                    }
                    if (result.fields[field.name].query.indexOf('system') < 0) {
                        result.fields[field.name].query.push('system');
                    }
                }
                else {
                    result.fields[field.name] = { query: ['system'] };
                }
                if (acl.update) {
                    if (Array.isArray(acl.update)) {
                        result.fields[field.name].mutate = [...acl.update];
                    }
                    else {
                        result.fields[field.name].mutate = [acl.update];
                    }
                    if (result.fields[field.name].mutate.indexOf('system') < 0) {
                        result.fields[field.name].mutate.push('system');
                    }
                }
                else {
                    result.fields[field.name].mutate = ['system'];
                }
            }
        }
        else {
            result.relations[field.name] = true;
            if (acl) {
                result.relations[field.name] = {};
                if (acl.read) {
                    if (Array.isArray(acl.read)) {
                        result.relations[field.name].query = [...acl.read];
                    }
                    else {
                        result.relations[field.name].query = [acl.read];
                    }
                    if (result.relations[field.name].query.indexOf('system') < 0) {
                        result.relations[field.name].query.push('system');
                    }
                }
                else {
                    result.relations[field.name] = { query: ['system'] };
                }
                if (acl.update) {
                    if (Array.isArray(acl.update)) {
                        result.relations[field.name].mutate = [...acl.update];
                    }
                    else {
                        result.relations[field.name].mutate = [acl.update];
                    }
                    if (result.relations[field.name].mutate.indexOf('system') < 0) {
                        result.relations[field.name].mutate.push('system');
                    }
                }
                else {
                    result.relations[field.name].mutate = ['system'];
                }
                if (acl.shape) {
                    if (Array.isArray(acl.shape)) {
                        result.relations[field.name].shape = [...acl.shape];
                    }
                    else {
                        result.relations[field.name].shape = [acl.shape];
                    }
                    result.relations[field.name].shape.forEach(profile => {
                        if (result.relations[field.name].query.indexOf(profile) > -1) {
                            result.relations[field.name].query.splice(result.relations[field.name].query.indexOf(profile), 1);
                        }
                        if (result.relations[field.name].mutate.indexOf(profile) > -1) {
                            result.relations[field.name].mutate.splice(result.relations[field.name].mutate.indexOf(profile), 1);
                        }
                    });
                }
                else {
                    result.relations[field.name].shape = [];
                }
            }
        }
    });
    return result;
}
function mapper(entity, pack, role, aclAllow, typeMapper, adapter) {
    const eACL = expandEntityACL(entity);
    entity.metadata.acl = eACL;
    const acl = buildACL(entity.metadata.acl, role, pack.metadata.acl);
    return {
        name: entity.name,
        acl,
        type: {
            resolver: entityMappers.type.resolver.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            entry: entityMappers.type.entry.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
        },
        connections: {
            types: entityMappers.connections.types.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            mutations: {
                resolver: entityMappers.connections.mutations.resolver.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
                types: entityMappers.connections.mutations.types.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            },
        },
        mutations: {
            resolver: entityMappers.mutations.resolver.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            types: entityMappers.mutations.types.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
        },
        query: {
            resolver: entityMappers.query.resolver.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            entry: entityMappers.query.entry.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            sortOrder: entityMappers.type.enums.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            filter: entityMappers.type.entry.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
        },
        subscriptions: Object.assign({}, entityMappers.subscriptions.resolver.mapper(entity, pack, role, aclAllow, typeMapper, adapter), entityMappers.subscriptions.types.mapper(entity, pack, role, aclAllow, typeMapper, adapter)),
        ensure: ensure.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
        data: {
            name: entity.name,
            adapter,
            schema: entityMappers.data.adapter.schema.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            connector: entityMappers.data.adapter.connector.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            model: entityMappers.data.types.model.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
        },
        dataPump: {
            config: entityMappers.dataPump.config.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
            queries: entityMappers.dataPump.queries.mapper(entity, pack, role, aclAllow, typeMapper, adapter),
        },
    };
}
exports.mapper = mapper;
//# sourceMappingURL=common.js.map