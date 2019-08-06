"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inflect = __importStar(require("inflected"));
exports.template = 'entity/query/entry.graphql.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, aclAllow, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    const mapToGQLTypes = typeMapper.graphql;
    let unique = [
        ...ids.map(f => ({
            name: f.name,
            type: 'ID',
        })),
        ...queries_1.getFieldsForAcl(role, pack)(aclAllow, entity).filter(queries_1.identityFields),
    ]
        .map(f => ({
        name: f.name,
        type: mapToGQLTypes(f.type),
    }))
        .map(i => `${i.name}: ${i.type}`)
        .join(', ');
    return {
        name: entity.name,
        plural: entity.plural,
        singularEntry: inflect.camelize(entity.name, false),
        pluralEntry: inflect.camelize(entity.plural, false),
        unique,
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=entry.graphql.js.map