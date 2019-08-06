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
const consts = __importStar(require("./consts"));
exports.consts = consts;
const operations = __importStar(require("./operations"));
exports.operations = operations;
const resource_1 = __importDefault(require("./resource"));
exports.Resource = resource_1.default;
const resourceContainer_1 = __importDefault(require("./resourceContainer"));
exports.ResourceContainer = resourceContainer_1.default;
const resourceOperation_1 = __importDefault(require("./resourceOperation"));
exports.ResourceOperation = resourceOperation_1.default;
const interfaces = __importStar(require("./interfaces"));
exports.interfaces = interfaces;
//# sourceMappingURL=index.js.map