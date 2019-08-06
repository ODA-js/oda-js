"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const queries_1 = require("../queries");
exports.mapper = queries_1.memoizeEntityMapper('schema/common', _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper, adapter) {
    let fieldsEntityAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    const mapToGQLTypes = typeMapper.graphql;
    const mapToTSTypes = typeMapper.typescript;
    return {
        name: entity.name,
        findQuery: utils_1.decapitalize(entity.name),
        ownerFieldName: utils_1.decapitalize(entity.name),
        fields: fieldsEntityAcl
            .filter(f => queries_1.persistentFields(f) || (queries_1.relations(f) && !f.derived))
            .map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
        })),
        unique: {
            find: [
                ...fieldsEntityAcl
                    .filter(queries_1.identityFields)
                    .filter(queries_1.oneUniqueInIndex(entity))
                    .map(f => ({
                    name: f.name,
                    type: mapToGQLTypes(f.type),
                    cName: utils_1.capitalize(f.name),
                })),
            ],
            complex: queries_1.complexUniqueIndex(entity).map(i => {
                let fields = Object.keys(i.fields)
                    .map(fn => entity.fields.get(fn))
                    .map(f => ({
                    name: f.name,
                    uName: utils_1.capitalize(f.name),
                    type: mapToGQLTypes(f.type),
                }))
                    .sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    }
                    else if (a.name < b.name) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                });
                return {
                    name: i.name,
                    fields,
                };
            }),
        },
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=ensure.js.map