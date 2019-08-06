"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_model_1 = require("oda-model");
const utils_1 = require("../../utils");
exports.template = 'entity/connections/types.graphql.njs';
const queries_1 = require("../../queries");
function generate(te, entity, pack, role, aclAllow, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper), exports.template);
}
exports.generate = generate;
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    const mapToGQLTypes = typeMapper.graphql;
    return {
        name: entity.name,
        plural: entity.plural,
        connections: queries_1.getFieldsForAcl(role, pack)(aclAllow, entity)
            .filter(queries_1.persistentRelations(pack))
            .filter(f => f.relation instanceof oda_model_1.HasMany || f.relation instanceof oda_model_1.BelongsToMany)
            .map(f => {
            let relFields = [];
            if (f.relation.fields && f.relation.fields.size > 0) {
                f.relation.fields.forEach(field => {
                    let argsString = utils_1.printArguments(field, mapToGQLTypes);
                    relFields.push({
                        name: field.name,
                        description: field.description
                            ? field.description
                                .split('\n')
                                .map(d => {
                                return d.trim().match(/#/) ? d : `# ${d}`;
                            })
                                .join('\n')
                            : field.description,
                        type: `${mapToGQLTypes(field.type)}${utils_1.printRequired(field)}`,
                        argsString: argsString ? `(${argsString})` : '',
                    });
                });
            }
            return {
                connectionName: f.relation.fullName,
                refType: f.relation.ref.entity,
                fields: relFields,
            };
        }),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=types.graphql.js.map