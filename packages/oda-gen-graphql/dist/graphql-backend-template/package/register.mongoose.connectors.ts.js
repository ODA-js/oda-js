"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = 'package/register.mongoose.connectors.ts.njs';
function generate(te, pack, typeMapper) {
    return te.run(mapper(pack, typeMapper), exports.template);
}
exports.generate = generate;
const queries_1 = require("../queries");
function mapper(pack, typeMapper) {
    return {
        entities: queries_1.getRealEntities(pack).map((e) => ({
            name: e.name,
            adapter: e.getMetadata('storage.adapter', 'mongoose'),
        })),
    };
}
exports.mapper = mapper;
//# sourceMappingURL=register.mongoose.connectors.ts.js.map