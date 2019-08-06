"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.template = 'package/type.index.ts.njs';
function generate(te, pack, typeMapper) {
    return te.run(mapper(pack, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../queries");
function mapper(pack, typeMapper) {
    return {
        name: utils_1.capitalize(pack.name),
        entities: queries_1.getRealEntities(pack).map((e) => ({
            name: e.name,
            entry: utils_1.decapitalize(e.name),
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=type.index.ts.js.map