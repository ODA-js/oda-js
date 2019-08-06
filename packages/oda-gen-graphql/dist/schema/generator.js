"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../graphql-backend-template/schema");
const path_1 = __importDefault(require("path"));
const writeFile_1 = require("./writeFile");
function generator(pkg, raw, rootDir, role, allow, typeMapper, adapter) {
    const sources = [];
    const prepared = [];
    console.time('prepare');
    prepared.push(schema_1.pkg.prepare(pkg, role, allow, typeMapper, adapter));
    prepared.push(...Array.from(pkg.entities.values())
        .filter((f) => !f.abstract)
        .map((entity) => {
        return Object.assign({ entity: entity.name }, schema_1.common.prepare(entity, pkg, role, allow, typeMapper, adapter));
    }));
    console.timeEnd('prepare');
    console.time('generate');
    prepared
        .map(item => {
        return raw.run(item.ctx, item.template).map(r => (Object.assign({ entity: item.entity }, r)));
    })
        .reduce((result, curr) => {
        result.push(...curr);
        return result;
    }, sources);
    console.timeEnd('generate');
    sources.forEach(f => {
        let fn = path_1.default.join(...[
            rootDir,
            pkg.name,
            ...(f.entity ? ['entities', f.entity] : [false]),
            f.name,
        ].filter(i => i));
        writeFile_1.writeFile(fn, f.content);
    });
}
exports.default = generator;
//# sourceMappingURL=generator.js.map