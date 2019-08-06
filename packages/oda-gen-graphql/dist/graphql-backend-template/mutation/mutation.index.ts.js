"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema = __importStar(require("./index"));
const utils_1 = require("../utils");
exports.template = 'mutation/mutation.index.ts.njs';
function generate(te, mutation, pack, role, aclAllow, typeMapper) {
    return te.run(mapper(mutation, pack, typeMapper), exports.template);
}
exports.generate = generate;
function mapper(mutation, pack, typeMapper) {
    return {
        name: utils_1.capitalize(mutation.name),
        partials: {
            entry: schema.entry.mapper(mutation, pack, typeMapper),
            types: schema.types.mapper(mutation, pack, typeMapper),
        },
    };
}
exports.mapper = mapper;
//# sourceMappingURL=mutation.index.ts.js.map