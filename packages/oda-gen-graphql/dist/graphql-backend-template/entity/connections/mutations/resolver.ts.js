"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../utils");
const queries_1 = require("../../../queries");
exports.template = 'entity/connections/mutations/resolver.ts.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper), exports.template);
}
exports.generate = generate;
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    const mapToTSTypes = typeMapper.typescript;
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    let embedded = queries_1.getFields(entity).filter(f => f.relation && f.relation.embedded);
    return {
        name: entity.name,
        ownerFieldName: utils_1.decapitalize(entity.name),
        embedded: Object.keys(embedded
            .map(f => f.relation.ref.entity)
            .reduce((res, i) => {
            res[i] = 1;
            return res;
        }, {})),
        connections: queries_1.getFieldsForAcl(role, pack)(aclAllow, entity)
            .filter(queries_1.persistentRelations(pack))
            .map(f => {
            let verb = f.relation.verb;
            let ref = {
                fields: [],
            };
            let sameEntity = entity.name === f.relation.ref.entity;
            let refFieldName = `${f.relation.ref.entity}${sameEntity ? utils_1.capitalize(f.name) : ''}`;
            let refEntity = f.relation.ref.entity;
            let addArgs = [
                {
                    name: utils_1.decapitalize(entity.name),
                    type: mapToTSTypes(ids[0].type),
                },
                {
                    name: utils_1.decapitalize(refFieldName),
                    type: f.relation.embedded
                        ? `Partial${f.relation.ref.entity}`
                        : mapToTSTypes(ids[0].type),
                },
            ];
            let removeArgs = f.relation.embedded ? [addArgs[0]] : [...addArgs];
            if (verb === 'BelongsToMany' && f.relation.using) {
                if (f.relation.fields && f.relation.fields.size > 0) {
                    f.relation.fields.forEach(field => {
                        ref.fields.push(field.name);
                        addArgs.push({
                            name: field.name,
                            type: mapToTSTypes(field.type),
                        });
                    });
                }
            }
            return {
                opposite: f.relation.opposite,
                refEntity,
                relationName: f.relation.fullName,
                shortName: f.relation.shortName,
                name: f.name,
                refFieldName: utils_1.decapitalize(refFieldName),
                addArgs,
                removeArgs,
                ref,
                single: f.relation.single,
                embedded: f.relation.embedded ? f.relation.ref.entity : false,
            };
        }),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=resolver.ts.js.map