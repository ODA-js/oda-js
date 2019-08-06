"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const template = __importStar(require("../graphql-backend-template"));
const acl_1 = __importDefault(require("../acl"));
const oda_gen_common_1 = require("oda-gen-common");
const { deepMerge } = oda_gen_common_1.lib;
const { defaultTypeMapper, prepareMapper } = template.utils;
const templateEngine_1 = __importDefault(require("./templateEngine"));
const initModel_1 = __importDefault(require("./initModel"));
const generator_1 = __importDefault(require("./generator"));
const validate_1 = require("./validate");
const writeFile_1 = require("./writeFile");
function generate({ hooks, schema, rootDir, templateRoot = path_1.default.resolve(__dirname, '../../js-templates'), acl, context, logs, }) {
    const actualTypeMapper = deepMerge(defaultTypeMapper, context.typeMapper || {});
    const defaultAdapter = context.defaultAdapter;
    let secureAcl = new acl_1.default(acl);
    const aclAllow = secureAcl.allow.bind(secureAcl);
    let raw = templateEngine_1.default({
        root: templateRoot,
    });
    const { modelStore, packages } = initModel_1.default({
        schema,
        hooks,
        secureAcl,
    });
    const systemPackage = packages.get('system');
    const typeMapper = Object.keys(actualTypeMapper).reduce((hash, type) => {
        hash[type] = prepareMapper(actualTypeMapper[type], systemPackage);
        return hash;
    }, {});
    const errors = validate_1.collectErrors(modelStore);
    if (validate_1.hasResult(errors, 'error')) {
        console.error('please fix followings errors to proceed');
        validate_1.showLog(errors, logs);
    }
    else {
        fs_extra_1.default.ensureDirSync(rootDir);
        [...packages.values()]
            .filter((p) => !p.abstract)
            .forEach((pkg) => {
            console.time('gql');
            generator_1.default(pkg, raw, rootDir, pkg.name, aclAllow, typeMapper, defaultAdapter);
            console.timeEnd('gql');
        });
    }
    console.time('format & save');
    writeFile_1.commit().then(() => console.timeEnd('format & save'));
}
exports.default = generate;
//# sourceMappingURL=generate.js.map