"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_model_1 = require("oda-model");
const inflect = __importStar(require("inflected"));
const utils_1 = require("../../utils");
exports.template = 'entity/query/resolver.ts.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper, adapter) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper, adapter), exports.template);
}
exports.generate = generate;
const queries_1 = require("../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper, adapter) {
    let fieldsAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    const mapToTSTypes = typeMapper.typescript;
    const mapToGQLTypes = typeMapper.graphql;
    const relations = fieldsAcl.filter(queries_1.relationFieldsExistsIn(pack)).map(f => {
        let verb = f.relation.verb;
        let ref = {
            usingField: '',
            backField: f.relation.ref.backField,
            entity: f.relation.ref.entity,
            field: f.relation.ref.field,
            type: pack.get(f.relation.ref.entity).fields.get(f.relation.ref.field)
                .type,
            cField: utils_1.capitalize(f.relation.ref.field),
            fields: [],
            using: {
                backField: '',
                entity: '',
                field: '',
            },
        };
        if (verb === 'BelongsToMany' && f.relation.using) {
            let current = f.relation;
            ref.using.entity = current.using.entity;
            ref.using.field = current.using.field;
            ref.backField = current.using.backField;
            let refe = pack.entities.get(ref.entity);
            let opposite = queries_1.getRelationNames(refe)
                .filter(r => (current.opposite && current.opposite === r) ||
                (refe.fields.get(r).relation instanceof oda_model_1.BelongsToMany &&
                    refe.fields.get(r).relation.using &&
                    refe.fields.get(r).relation.using.entity ===
                        f.relation.using.entity))
                .map(r => refe.fields.get(r).relation)
                .filter(r => r instanceof oda_model_1.BelongsToMany && current !== r)[0];
            if (opposite) {
                ref.usingField = opposite.using.field;
                ref.backField = opposite.ref.field;
            }
            else {
                ref.usingField = utils_1.decapitalize(ref.entity);
            }
            if (f.relation.fields && f.relation.fields.size > 0) {
                f.relation.fields.forEach(field => {
                    ref.fields.push(field.name);
                });
            }
        }
        let sameEntity = entity.name === f.relation.ref.entity;
        let refFieldName = `${f.relation.ref.entity}${sameEntity ? utils_1.capitalize(f.name) : ''}`;
        return {
            derived: f.derived,
            field: f.name,
            name: utils_1.capitalize(f.name),
            refFieldName: utils_1.decapitalize(refFieldName),
            verb,
            ref,
        };
    });
    return {
        name: entity.name,
        singular: inflect.camelize(entity.name, false),
        plural: inflect.camelize(entity.plural, false),
        unique: {
            args: [
                ...ids,
                ...fieldsAcl.filter(queries_1.identityFields).filter(queries_1.oneUniqueInIndex(entity)),
            ].map(f => ({
                name: f.name,
                type: mapToTSTypes(f.type),
            })),
            find: [
                ...fieldsAcl
                    .filter(queries_1.identityFields)
                    .filter(queries_1.oneUniqueInIndex(entity))
                    .map(f => ({
                    name: f.name,
                    type: mapToTSTypes(f.type),
                    cName: utils_1.capitalize(f.name),
                })),
            ],
            complex: queries_1.complexUniqueIndex(entity).map(i => {
                let fields = Object.keys(i.fields)
                    .map(fn => entity.fields.get(fn))
                    .map(f => ({
                    name: f.name,
                    uName: utils_1.capitalize(f.name),
                    type: mapToTSTypes(f.type),
                    gqlType: mapToGQLTypes(f.type),
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
        relations,
        adapter,
        idMap: relations
            .filter(f => f.ref.type === 'ID' && f.verb === 'BelongsTo')
            .map(f => f.field),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=resolver.ts.js.map