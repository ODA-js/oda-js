"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
exports.mapper = common_1.mapper;
exports.template = 'entity/UI/forms.ts.njs';
function generate(te, entity, pack, role, aclAllow, typeMapper) {
    return te.run(common_1.mapper(entity, pack, role, aclAllow, typeMapper), exports.template);
}
exports.generate = generate;
//# sourceMappingURL=forms.ts.js.map