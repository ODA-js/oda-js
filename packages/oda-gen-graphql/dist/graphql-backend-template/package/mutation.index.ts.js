"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.template = 'package/mutation.index.ts.njs';
function generate(te, pack, typeMapper) {
    return te.run(mapper(pack, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../queries");
function mapper(pack, typeMapper) {
    return {
        name: utils_1.capitalize(pack.name),
        mutations: queries_1.getMutations(pack).map(e => ({
            name: e.name,
            entry: utils_1.capitalize(e.name),
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=mutation.index.ts.js.map