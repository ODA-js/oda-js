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
function $generateData(pkg, raw, rootDir, typeMapper, defaultAdapter, collection, cfg, type, route, ext, fileName) {
    let runConfig = get(cfg[type], route);
    if (runConfig) {
        let list;
        if (Array.isArray(runConfig)) {
            collection.filter(e => runConfig.includes(e.name));
        }
        else {
            list = collection;
        }
        for (let entity of list) {
            let source = get(template, `${type}.${route}`).generate(raw, entity, pkg, 'system', undefined, typeMapper, defaultAdapter);
            if (typeof source === 'string') {
                let parts = route.split('.').slice(1);
                if (!fileName) {
                    parts[parts.length - 1] = `${parts[parts.length - 1]}.${ext}`;
                }
                else {
                    parts[parts.length - 1] = fileName;
                }
                let fn = path_1.default.join(rootDir, 'data', `${entity.name}`, ...parts);
                writeFile_1.writeFile(fn, source);
            }
            else if (Array.isArray(source)) {
                let parts = route.split('.').slice(1);
                source.forEach(f => {
                    parts[parts.length - 1] = `${f.name}.${ext}`;
                    let fn = path_1.default.join(rootDir, 'data', `${entity.name}`, ...parts);
                    writeFile_1.writeFile(fn, f.content);
                });
            }
        }
    }
}
exports.default = $generateData;
//# sourceMappingURL=data.js.map