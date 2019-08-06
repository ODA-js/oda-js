"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = __importDefault(require("./rules/entity"));
const field_1 = __importDefault(require("./rules/field"));
const model_1 = __importDefault(require("./rules/model"));
const package_1 = __importDefault(require("./rules/package"));
const relation_1 = require("./rules/relation");
const validator_1 = require("./validator");
const validator = new validator_1.Validator();
validator.registerRule('model', [...model_1.default]);
validator.registerRule('package', [...package_1.default]);
validator.registerRule('entity', [...entity_1.default]);
validator.registerRule('field', [...field_1.default]);
validator.registerRule('relation', [...relation_1.common]);
validator.registerRule('BelongsTo', [...relation_1.belongsTo]);
validator.registerRule('BelongsToMany', [...relation_1.belongsToMany]);
validator.registerRule('HasOne', [...relation_1.hasOne]);
validator.registerRule('HasMany', [...relation_1.hasMany]);
exports.default = () => {
    return validator;
};
//# sourceMappingURL=index.js.map