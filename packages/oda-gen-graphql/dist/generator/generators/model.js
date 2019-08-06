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
function $generateModel(raw, rootDir, model, typeMapper, route, fileName) {
    let source = get(template, `model.${route}`).generate(raw, model, typeMapper);
    let fn = path_1.default.join(rootDir, fileName);
    if (typeof source === 'string') {
        fn = path_1.default.join(rootDir, fileName);
        writeFile_1.writeFile(fn, source);
    }
    else if (Array.isArray(source)) {
        let parts = route.split('.').slice(1);
        source.forEach(f => {
            fn = path_1.default.join(rootDir, f.name);
            writeFile_1.writeFile(fn, f.content);
        });
    }
}
exports.default = $generateModel;
//# sourceMappingURL=model.js.map