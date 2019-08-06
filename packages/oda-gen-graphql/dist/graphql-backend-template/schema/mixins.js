"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
const queries_1 = require("../queries");
function mapper(entity, pack, role, aclAllow, typeMapper, adapter) {
    let fieldsAcl = queries_1.getFieldsForAcl(role, pack)(aclAllow, entity);
    const mapToGQLTypes = typeMapper.graphql;
    return {
        name: entity.name,
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
    };
}
exports.mapper = mapper;
//# sourceMappingURL=mixins.js.map