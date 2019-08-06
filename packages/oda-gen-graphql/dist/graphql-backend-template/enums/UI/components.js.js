"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = 'enums/UI/components.js.njs';
function generate(te, mutation, pack, role, aclAllow, typeMapper) {
    return te.run(mapper(mutation, pack, typeMapper), exports.template);
}
exports.generate = generate;
function mapper(mutation, pack, typeMapper) {
    return mutation;
}
exports.mapper = mapper;
//# sourceMappingURL=components.js.js.map