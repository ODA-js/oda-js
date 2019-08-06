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
const updateField_1 = __importDefault(require("./updateField"));
exports.updateField = updateField_1.default;
const createField_1 = __importDefault(require("./createField"));
exports.createField = createField_1.default;
const updateMany_1 = __importDefault(require("./updateMany"));
exports.updateMany = updateMany_1.default;
const createMany_1 = __importDefault(require("./createMany"));
exports.createMany = createMany_1.default;
const updateSingle_1 = __importDefault(require("./updateSingle"));
exports.updateSingle = updateSingle_1.default;
const createSingle_1 = __importDefault(require("./createSingle"));
exports.createSingle = createSingle_1.default;
const resource = __importStar(require("./resource"));
exports.resource = resource;
//# sourceMappingURL=index.js.map