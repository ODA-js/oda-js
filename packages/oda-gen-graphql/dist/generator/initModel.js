"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_gen_common_1 = require("oda-gen-common");
const oda_model_1 = require("oda-model");
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const utils_2 = require("./utils");
const { get } = oda_gen_common_1.lib;
function default_1({ pack, hooks, secureAcl, config, }) {
    let modelStore = new oda_model_1.MetaModel('system');
    if (typeof pack === 'string') {
        modelStore.loadModel(path_1.default.resolve(__dirname, '../test.json'));
    }
    else {
        modelStore.loadPackage(pack, hooks);
        modelStore.saveModel('compiledModel.json');
    }
    let pckgs = utils_1.initPackages(secureAcl);
    modelStore.entities.forEach((entity, key) => {
        utils_1.pushToAppropriate({
            item: entity,
            acl: get(entity, 'metadata.acl.create'),
            path: 'entities',
            packages: pckgs,
        });
        utils_1.pushToAppropriate({
            item: entity,
            acl: get(entity, 'metadata.acl.read'),
            path: 'entities',
            packages: pckgs,
        });
        utils_1.pushToAppropriate({
            item: entity,
            acl: get(entity, 'metadata.acl.update'),
            path: 'entities',
            packages: pckgs,
        });
        utils_1.pushToAppropriate({
            item: entity,
            acl: get(entity, 'metadata.acl.delete'),
            path: 'entities',
            packages: pckgs,
        });
        utils_1.pushToAppropriate({
            item: entity,
            acl: 'system',
            path: 'entities',
            packages: pckgs,
        });
    });
    modelStore.mutations.forEach((mutation, key) => {
        utils_1.pushToAppropriate({
            item: mutation,
            acl: get(mutation, 'metadata.acl.execute'),
            path: 'mutations',
            packages: pckgs,
        });
        utils_1.pushToAppropriate({
            item: mutation,
            acl: 'system',
            path: 'mutations',
            packages: pckgs,
        });
    });
    Object.keys(pckgs)
        .reduce((result, cur) => {
        result.push({
            name: cur,
            abstract: false,
            acl: pckgs[cur].acl,
            entities: Object.keys(pckgs[cur].entities),
            mutations: Object.keys(pckgs[cur].mutations),
        });
        return result;
    }, [])
        .forEach(p => {
        modelStore.addPackage(p);
    });
    const packageNames = Array.from(modelStore.packages.keys());
    config = utils_2.expandConfig(config, packageNames);
    let generatedPackages = Object.keys(config.packages).reduce((hash, cur) => {
        hash[cur] = 1;
        return hash;
    }, {});
    let packages = new Map(Array.from(modelStore.packages.entries()).filter(i => {
        return generatedPackages[i[0]];
    }));
    return {
        modelStore,
        packages,
        config,
    };
}
exports.default = default_1;
//# sourceMappingURL=initModel.js.map