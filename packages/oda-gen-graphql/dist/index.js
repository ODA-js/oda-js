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
const generator_1 = require("./generator");
exports.generator = generator_1.generator;
exports.validate = generator_1.validate;
const oda_gen_common_1 = __importDefault(require("oda-gen-common"));
exports.common = oda_gen_common_1.default;
const templates = __importStar(require("./graphql-backend-template"));
exports.templates = templates;
const odaGen = __importStar(require("./schema"));
exports.odaGen = odaGen;
//# sourceMappingURL=index.js.map