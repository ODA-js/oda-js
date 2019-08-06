"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../../utils");
exports.template = 'entity/type/entry.graphql.njs';
function generate(te, entity, pack, role, allowAcl, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, allowAcl, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    let fieldsAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    const mapToGQLTypes = typeMapper.graphql;
    let filter = queries_1.filterForAcl(role, pack)(aclAllow, entity)
        .filter(k => {
        let f = entity.fields.get(k);
        if (!f.relation) {
            return true;
        }
        if (!((f.relation && f.relation.embedded) || f.relation.stored)) {
            return false;
        }
        let ref = pack.relations.get(entity.name).get(f.name);
        if (!ref) {
            return false;
        }
        let ent = pack.entities.get(ref.relation.ref.entity);
        return !!ent;
    })
        .map(k => {
        let field = entity.fields.get(k);
        let type;
        if (field.relation) {
            if (field.relation.embedded) {
                let ref = pack.relations.get(entity.name).get(field.name);
                let ent = pack.entities.get(ref.relation.ref.entity);
                type = `${ent.name}Filter`;
            }
            else {
                let ref = pack.relations.get(entity.name).get(field.name);
                let ent = pack.entities.get(ref.relation.ref.entity);
                type = ent.fields.get(ref.relation.ref.field).type;
                type = `Where${queries_1.idField(field) ? 'ID' : mapToGQLTypes(type)}`;
            }
        }
        else {
            if (pack.entities.has(typeof field.type === 'string' ? field.type : field.type.name)) {
                type = 'id';
            }
            else if (pack.enums.has(typeof field.type === 'string' ? field.type : field.type.name)) {
                type = typeof field.type === 'string' ? field.type : field.type.name;
            }
            else {
                type = field.type;
            }
            type = `Where${queries_1.idField(field) ? 'ID' : mapToGQLTypes(type)}`;
        }
        return {
            name: k,
            type,
        };
    })
        .map(i => `${i.name}: ${i.type}`);
    let filterEmbed = queries_1.filterForAcl(role, pack)(aclAllow, entity)
        .filter(k => {
        let f = entity.fields.get(k);
        if (!f.relation) {
            return true;
        }
        let ref = pack.relations.get(entity.name).get(f.name);
        if (!ref) {
            return false;
        }
        let ent = pack.entities.get(ref.relation.ref.entity);
        return !!ent;
    })
        .map(k => {
        let field = entity.fields.get(k);
        let type;
        if (field.relation) {
            let ref = pack.relations.get(entity.name).get(field.name);
            let ent = pack.entities.get(ref.relation.ref.entity);
            type = `${field.relation.single ? '' : 'Embed'}${ent.name}Filter`;
        }
        else {
            type = `Where${queries_1.idField(field) ? 'ID' : mapToGQLTypes(field.type)}`;
        }
        return {
            name: k,
            type,
        };
    })
        .map(i => `${i.name}: ${i.type}`);
    let filterSubscriptions = queries_1.filterForAcl(role, pack)(aclAllow, entity)
        .map(k => {
        let field = entity.fields.get(k);
        let type = `Where${queries_1.idField(field) ? 'ID' : mapToGQLTypes(field.type)}`;
        return {
            name: k,
            type,
        };
    })
        .map(i => `${i.name}: ${i.type}`);
    return {
        name: entity.name,
        implements: Array.from(entity.implements),
        description: entity.description
            ? entity.description
                .split('\n')
                .map(d => {
                return d.trim().match(/#/) ? d : `# ${d}`;
            })
                .join('\n')
            : entity.description,
        filter,
        filterEmbed,
        filterSubscriptions,
        fields: fieldsAcl.filter(queries_1.fields).map(f => {
            let args = utils_1.printArguments(f, mapToGQLTypes);
            return {
                name: f.name,
                description: f.description
                    ? f.description
                        .split('\n')
                        .map(d => {
                        return d.trim().match(/#/) ? d : `# ${d}`;
                    })
                        .join('\n')
                    : f.description,
                type: `${queries_1.idField(f) ? 'ID' : mapToGQLTypes(f.type)}${utils_1.printRequired(f)}`,
                args: args ? `(${args})` : '',
            };
        }),
        relations: fieldsAcl.filter(queries_1.relationFieldsExistsIn(pack)).map(f => {
            let single = f.relation.single;
            let args = utils_1.printArguments(f, mapToGQLTypes);
            if (args) {
                if (single) {
                    args = `(${args})`;
                }
                else {
                    args = `, ${args}`;
                }
            }
            let refe = pack.entities.get(f.relation.ref.entity);
            return {
                entity: f.relation.ref.entity,
                name: f.name,
                description: f.description
                    ? f.description
                        .split('\n')
                        .map(d => {
                        return d.trim().match(/#/) ? d : `# ${d}`;
                    })
                        .join('\n')
                    : f.description,
                single,
                embedded: f.relation.embedded,
                args,
                type: `${mapToGQLTypes(f.relation.ref.entity)}${utils_1.printRequired(f)}`,
                connectionName: `${f.derived ? refe.plural : f.relation.fullName}Connection${utils_1.printRequired(f)}`,
            };
        }),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=entry.graphql.js.map