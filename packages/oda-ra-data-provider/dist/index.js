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
const constants = __importStar(require("./constants"));
exports.constants = constants;
const apollo_1 = __importDefault(require("./apollo"));
exports.apollo = apollo_1.default;
const client_1 = __importDefault(require("./client"));
exports.client = client_1.default;
const data = __importStar(require("./data"));
exports.data = data;
//# sourceMappingURL=index.js.map