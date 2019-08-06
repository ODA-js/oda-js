"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_gen_common_1 = require("oda-gen-common");
const template = __importStar(require("../../graphql-backend-template"));
const path_1 = __importDefault(require("path"));
const writeFile_1 = require("./writeFile");
const { get, deepMerge } = oda_gen_common_1.lib;
function $generatePkg(raw, rootDir, typeMapper, pkg, type, route, fileName) {
    let source = get(template, `packages.${route}`).generate(raw, pkg, typeMapper);
    if (typeof source === 'string') {
        let fn = type
            ? path_1.default.join(rootDir, pkg.name, type, fileName)
            : path_1.default.join(rootDir, pkg.name, fileName);
        writeFile_1.writeFile(fn, source);
    }
    else if (Array.isArray(source)) {
        let parts = route.split('.').slice(1);
        source.forEach(f => {
            let fn = type
                ? path_1.default.join(rootDir, pkg.name, type, f.name)
                : path_1.default.join(rootDir, pkg.name, f.name);
            writeFile_1.writeFile(fn, f.content);
        });
    }
}
exports.default = $generatePkg;
//# sourceMappingURL=package.js.map