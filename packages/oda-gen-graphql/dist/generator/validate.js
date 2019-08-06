"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_model_1 = require("oda-model");
const path_1 = __importDefault(require("path"));
const acl_1 = __importDefault(require("../acl"));
const initModel_1 = __importDefault(require("./initModel"));
function hasResult(log, type) {
    return log.some(item => item.result === type);
}
exports.hasResult = hasResult;
function showLog(log, visibility = [
    'error',
    'warning',
    'critics',
    'fixable',
]) {
    if (!Array.isArray(visibility)) {
        visibility = [visibility];
    }
    visibility.forEach(visibilityItem => {
        const current = log.filter(item => item.result === visibilityItem);
        const errorLog = current.reduce((status, item) => {
            if (!status[item.package]) {
                status[item.package] = {};
            }
            if (!status[item.package][item.entity]) {
                status[item.package][item.entity] = {};
            }
            if (!status[item.package][item.entity][item.field]) {
                status[item.package][item.entity][item.field] = {};
            }
            if (!status[item.package][item.entity][item.field][item.result]) {
                status[item.package][item.entity][item.field][item.result] = [];
            }
            status[item.package][item.entity][item.field][item.result].push(item.message);
            return status;
        }, {});
        if (current.length > 0) {
            console.log(visibilityItem);
            Object.keys(errorLog).forEach(pkg => {
                console.log(`package: ${pkg}`);
                Object.keys(errorLog[pkg]).forEach(entity => {
                    console.log(`  ${entity}`);
                    Object.keys(errorLog[pkg][entity]).forEach(field => {
                        const errList = Object.keys(errorLog[pkg][entity][field]).filter(c => c === visibilityItem);
                        if (errList.length > 0) {
                            console.log(`    ${field}`);
                            errorLog[pkg][entity][field][errList[0]].forEach(m => {
                                console.log(`      ${m}`);
                            });
                        }
                    });
                });
            });
        }
    });
}
exports.showLog = showLog;
function collectErrors(model) {
    const validator = oda_model_1.Validator();
    const errors = model.validate(validator);
    return errors;
}
exports.collectErrors = collectErrors;
exports.default = (args) => {
    let { hooks, pack, rootDir, templateRoot = path_1.default.resolve(__dirname, '../../js-templates'), config = {
        graphql: false,
        ts: false,
        packages: false,
        ui: false,
    }, acl, context = {}, logs, } = args;
    let secureAcl = new acl_1.default(acl);
    const { modelStore } = initModel_1.default({
        pack,
        hooks,
        secureAcl,
        config,
    });
    const errors = collectErrors(modelStore);
    showLog(errors, logs);
};
//# sourceMappingURL=validate.js.map