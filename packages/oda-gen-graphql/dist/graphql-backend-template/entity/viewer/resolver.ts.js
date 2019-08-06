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
exports.template = 'entity/viewer/resolver.ts.njs';
function generate(te, entity, pack, role, allowAcl, typeMapper) {
    return te.run(exports.mapper(entity, pack, role, allowAcl, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../../queries");
exports.mapper = queries_1.memoizeEntityMapper(exports.template, _mapper);
function _mapper(entity, pack, role, aclAllow, typeMapper) {
    let fieldsAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    let ids = queries_1.getFields(entity).filter(queries_1.idField);
    const mapToTSTypes = typeMapper.typescript;
    return {
        name: entity.name,
        singular: inflect.camelize(entity.name, false),
        plural: inflect.camelize(entity.plural, false),
        unique: [...ids, ...fieldsAcl.filter(queries_1.identityFields)].map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
        })),
        indexed: fieldsAcl.filter(queries_1.indexedFields).map(f => ({
            name: f.name,
            type: mapToTSTypes(f.type),
        })),
    };
}
exports._mapper = _mapper;
//# sourceMappingURL=resolver.ts.js.map