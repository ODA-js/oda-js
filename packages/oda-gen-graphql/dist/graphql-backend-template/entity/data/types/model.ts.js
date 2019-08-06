"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = 'entity/data/types/model.ts.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper, defaultAdapter) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper, defaultAdapter), exports.template);
}
exports.generate = generate;
const queries_1 = require("../../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper, adapter) {
    const mapToTSTypes = typeMapper.typescript;
    const relations = queries_1.relationFieldsExistsIn(pack);
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    let embedded = queries_1.getFields(entity).filter(f => f.relation && f.relation.embedded);
    const fields = [
        ...ids,
        ...queries_1.getFields(entity).filter(f => relations(f) || queries_1.mutableFields(f)),
    ];
    const externalImport = fields.filter(f => f.relation && !f.relation.embedded);
    return {
        name: entity.name,
        plural: entity.plural,
        description: entity.description,
        embedded: Object.keys(embedded
            .map(f => f.relation.ref.entity)
            .reduce((res, i) => {
            res[i] = 1;
            return res;
        }, {})),
        externalImport: Object.keys(externalImport
            .map(f => f.relation.ref.entity)
            .reduce((res, i) => {
            res[i] = 1;
            return res;
        }, {})),
        fields: fields.map(f => {
            return {
                name: f.name,
                type: `${f.relation && f.relation.embedded
                    ? 'I' + f.relation.ref.entity
                    : mapToTSTypes(f.type)}${f.relation && !f.relation.single ? '[]' : ''}`,
                inputType: `${f.relation && f.relation.embedded
                    ? 'I' + f.relation.ref.entity
                    : f.relation
                        ? mapToTSTypes({
                            type: 'entity',
                            name: f.relation.ref.entity,
                            multiplicity: f.relation.single ? 'single' : 'many',
                        })
                        : mapToTSTypes(f.type)}${f.relation && !f.relation.single ? '[]' : ''}`,
                required: f.required,
            };
        }),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=model.ts.js.map