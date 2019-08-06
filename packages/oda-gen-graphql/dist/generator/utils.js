"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaultConfig_1 = __importDefault(require("./defaultConfig"));
function ensureConfigValues(cp, pname) {
    if (!(cp.hasOwnProperty(pname) ||
        typeof cp[pname] === 'boolean' ||
        Array.isArray(cp[pname]))) {
        return false;
    }
    else {
        return cp[pname];
    }
}
exports.ensureConfigValues = ensureConfigValues;
function fill(src, value) {
    const result = {};
    let keys = Object.keys(src);
    for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i];
        if (typeof src[key] === 'object') {
            result[key] = fill(src[key], value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
exports.fill = fill;
function traversePackage(src, origin) {
    let result;
    if (src === undefined || src === null || src === '') {
        result = fill(origin, false);
    }
    else if (Array.isArray(src)) {
        for (let i = 0, len = src.length; i < len; i++) {
            result = fill(origin, src);
        }
    }
    else if (typeof src === 'boolean') {
        result = fill(origin, src);
    }
    else {
        result = {};
        let keys = Object.keys(origin);
        for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i];
            if (origin.hasOwnProperty(key)) {
                let origType = typeof origin[key];
                if (origType === 'boolean') {
                    result[key] = ensureConfigValues(src, key);
                }
                else if (origType === 'object') {
                    result[key] = traversePackage(src[key], origin[key]);
                }
            }
        }
    }
    return result;
}
exports.traversePackage = traversePackage;
exports.expandConfig = (config, packages) => {
    let packConfig = {};
    if (!config.hasOwnProperty('graphql')) {
        packConfig.graphql = defaultConfig_1.default.graphql;
    }
    else {
        packConfig.graphql = config.graphql;
    }
    if (!config.hasOwnProperty('ts')) {
        packConfig.ts = defaultConfig_1.default.ts;
    }
    else {
        packConfig.ts = config.ts;
    }
    if (!config.hasOwnProperty('ui')) {
        packConfig.ui = defaultConfig_1.default.ui;
    }
    else {
        packConfig.ui = config.ui;
    }
    if (!config.hasOwnProperty('schema')) {
        packConfig.schema = defaultConfig_1.default.schema;
    }
    else {
        packConfig.schema = config.schema;
    }
    if (config.packages === undefined) {
        config.packages = defaultConfig_1.default.package;
    }
    if (!Array.isArray(packages)) {
        packages = ['system'];
    }
    else if (packages.length === 0) {
        packages.push('system');
    }
    packConfig.packages = {};
    if (typeof config.packages === 'boolean') {
        if (config.packages) {
            config.packages = {};
            for (let i = 0, len = packages.length; i < len; i++) {
                packConfig.packages[packages[i]] = defaultConfig_1.default.package;
            }
        }
    }
    else if (Array.isArray(config.packages)) {
        for (let i = 0, len = config.packages.length; i < len; i++) {
            packConfig.packages[config.packages[i]] = defaultConfig_1.default.package;
        }
    }
    else if (typeof config.packages === 'object') {
        if (config.packages.hasOwnProperty('mutation') ||
            config.packages.hasOwnProperty('entity') ||
            config.packages.hasOwnProperty('package')) {
            for (let i = 0, len = packages.length; i < len; i++) {
                packConfig.packages[packages[i]] = config.packages;
            }
        }
        else {
            let packagesNames = Object.keys(config.packages);
            for (let i = 0, len = packagesNames.length; i < len; i++) {
                let currPack = config.packages[packagesNames[i]];
                packConfig.packages[packagesNames[i]] = traversePackage(currPack, defaultConfig_1.default.package);
            }
        }
    }
    return packConfig;
};
function initPackages(secureAcl) {
    return secureAcl.roles.reduce((store, cur) => {
        if (!store[cur]) {
            store[cur] = {
                entities: {},
                mutations: {},
            };
        }
        return store;
    }, {});
}
exports.initPackages = initPackages;
function pushToAppropriate({ item, acl, path, packages, }) {
    if (acl) {
        if (!Array.isArray(acl)) {
            acl = [acl];
        }
        for (let i = 0, len = acl.length; i < len; i++) {
            packages[acl[i]][path][item.name] = true;
        }
    }
}
exports.pushToAppropriate = pushToAppropriate;
//# sourceMappingURL=utils.js.map