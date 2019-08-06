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
const graphql_1 = __importDefault(require("./generators/graphql"));
const data_1 = __importDefault(require("./generators/data"));
const dataPackage_1 = __importDefault(require("./generators/dataPackage"));
const package_1 = __importDefault(require("./generators/package"));
const model_1 = __importDefault(require("./generators/model"));
const templateEngine_1 = __importDefault(require("./templateEngine"));
const initModel_1 = __importDefault(require("./initModel"));
const validate_1 = require("./validate");
const writeFile_1 = require("./generators/writeFile");
exports.default = (args) => {
    let { hooks, pack, rootDir, templateRoot = path_1.default.resolve(__dirname, '../../js-templates'), config = {
        graphql: false,
        ts: false,
        packages: false,
        ui: false,
    }, acl, context = {}, logs, } = args;
    const actualTypeMapper = deepMerge(defaultTypeMapper, context.typeMapper || {});
    const defaultAdapter = context.defaultAdapter;
    let secureAcl = new acl_1.default(acl);
    const aclAllow = secureAcl.allow.bind(secureAcl);
    let raw = templateEngine_1.default({
        root: templateRoot,
    });
    const { modelStore, packages, config: _config } = initModel_1.default({
        pack,
        hooks,
        secureAcl,
        config,
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
        validate_1.showLog(errors, logs);
        config = _config;
        fs_extra_1.default.ensureDirSync(rootDir);
        if (config.ts) {
            let dataPackage = modelStore.packages.get('system');
            let curConfig = config.packages['system'];
            let generateData = data_1.default.bind(null, dataPackage, raw, rootDir, typeMapper, defaultAdapter, Array.from(dataPackage.entities.values()), curConfig, 'entity');
            let generatePkg = dataPackage_1.default.bind(null, raw, rootDir, dataPackage, typeMapper);
            generateData('data.adapter.connector', 'ts');
            generateData('data.adapter.schema', 'ts');
            generateData('data.types.model', 'ts');
            generatePkg('indexMongooseConnectors', 'connectorIndex.ts');
            generatePkg('registerMongooseConnectors', 'registerConnectors.ts');
        }
        if (config.ts) {
            model_1.default(raw, rootDir, { packages }, typeMapper, 'registerConnectors', 'registerConnectors.ts');
        }
        packages.forEach((pkg) => {
            let generate = graphql_1.default.bind(null, pkg, raw, rootDir, pkg.name, aclAllow, typeMapper, defaultAdapter);
            let generatePkg = package_1.default.bind(null, raw, rootDir, typeMapper);
            const curConfig = config.packages[pkg.name];
            const entities = Array.from(pkg.entities.values());
            const mutations = Array.from(pkg.mutations.values());
            const enums = Array.from(pkg.enums.values());
            if (!pkg.abstract) {
                if (config.graphql) {
                    generate(entities, curConfig, 'entity', 'connections.mutations.entry', 'graphql');
                    generate(entities, curConfig, 'entity', 'connections.mutations.types', 'graphql');
                    generate(entities, curConfig, 'entity', 'connections.types', 'graphql');
                    generate(entities, curConfig, 'entity', 'mutations.entry', 'graphql');
                    generate(entities, curConfig, 'entity', 'mutations.types', 'graphql');
                    generate(entities, curConfig, 'entity', 'dataPump.queries', 'graphql');
                    generate(entities, curConfig, 'entity', 'subscriptions.entry', 'graphql');
                    generate(entities, curConfig, 'entity', 'subscriptions.types', 'graphql');
                    generate(entities, curConfig, 'entity', 'query.entry', 'graphql');
                    generate(entities, curConfig, 'entity', 'viewer.entry', 'graphql');
                    generate(entities, curConfig, 'entity', 'type.entry', 'graphql');
                    generate(entities, curConfig, 'entity', 'type.enums', 'graphql');
                    generate(mutations, curConfig, 'mutation', 'types', 'graphql');
                    generate(mutations, curConfig, 'mutation', 'entry', 'graphql');
                }
                if (config.ts) {
                    generate(entities, curConfig, 'entity', 'connections.mutations.resolver', 'ts');
                    generate(entities, curConfig, 'entity', 'mutations.resolver', 'ts');
                    generate(entities, curConfig, 'entity', 'dataPump.config', 'ts');
                    generate(entities, curConfig, 'entity', 'subscriptions.resolver', 'ts');
                    generate(entities, curConfig, 'entity', 'query.resolver', 'ts');
                    generate(entities, curConfig, 'entity', 'viewer.resolver', 'ts');
                    generate(entities, curConfig, 'entity', 'type.resolver', 'ts');
                    generate(entities, curConfig, 'entity', 'index', 'ts');
                    generate(mutations, curConfig, 'mutation', 'resolver', 'ts');
                    generate(mutations, curConfig, 'mutation', 'index', 'ts');
                    generatePkg(pkg, '', 'graphqlIndex', 'index.ts');
                    generatePkg(pkg, '', 'graphqlSchema', 'schema.ts');
                    generatePkg(pkg, 'entity', 'typeIndex', 'index.ts');
                    generatePkg(pkg, 'entity', 'node', 'node.ts');
                    generatePkg(pkg, 'entity', 'viewer', 'viewer.ts');
                    generatePkg(pkg, 'mutation', 'mutationIndex', 'index.ts');
                }
                if (config.ui) {
                    generatePkg(pkg, '', 'uiIndex', 'index.js');
                    generate(entities, curConfig, 'entity', 'UI.queries', 'js');
                    generate(entities, curConfig, 'entity', 'UI.forms', 'js');
                    generate(enums, curConfig, 'enums', 'UI.components', 'js');
                }
            }
            if (config.schema) {
                generatePkg(pkg, 'schema', 'schemaPuml', 'schema.puml');
            }
        });
    }
    writeFile_1.commit().then(() => console.log('finish'));
};
//# sourceMappingURL=generator.js.map