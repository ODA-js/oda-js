"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = 'model/packages.registerConnectors.ts.njs';
function generate(te, pack, typeMapper) {
    return te.run(mapper(pack, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../queries");
function mapper(model, typeMapper) {
    return {
        packageList: queries_1.getPackages(model)
            .filter((p) => !p.abstract)
            .map((e) => ({
            name: e.name,
            entry: 'entry' + e.name,
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=packages.registerConnectors.ts.js.map