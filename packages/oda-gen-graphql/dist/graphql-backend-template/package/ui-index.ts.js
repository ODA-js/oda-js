"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.template = 'entity/UI/ui-index.ts.njs';
function generate(te, pack, typeMapper) {
    return te.run(mapper(pack, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../queries");
function mapper(pack, typeMapper) {
    return {
        name: utils_1.capitalize(pack.name),
        role: pack.name,
        entities: queries_1.getUIEntities(pack).map((e) => ({
            name: e.name,
            entry: utils_1.decapitalize(e.name),
            embedded: e.embedded,
            abstract: e.abstract,
        })),
        enums: queries_1.getEnums(pack).map((p) => ({
            name: p.name,
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=ui-index.ts.js.map