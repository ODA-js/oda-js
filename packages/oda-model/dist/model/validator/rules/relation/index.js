"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ownerFieldIsIdentity_1 = __importDefault(require("./belongsTo/ownerFieldIsIdentity"));
const ownerFieldNotIndexed_1 = __importDefault(require("./belongsTo/ownerFieldNotIndexed"));
const refBackFieldIsIdentity_1 = __importDefault(require("./belongsTo/refBackFieldIsIdentity"));
const refBackFieldNotExists_1 = __importDefault(require("./belongsTo/refBackFieldNotExists"));
const refBackFieldNotIndexed_1 = __importDefault(require("./belongsTo/refBackFieldNotIndexed"));
const refFieldNotIdentity_1 = __importDefault(require("./belongsTo/refFieldNotIdentity"));
const refEntityNotFound_1 = __importDefault(require("./belongsToMany/refEntityNotFound"));
const usingBackFieldNotExists_1 = __importDefault(require("./belongsToMany/usingBackFieldNotExists"));
const usingBackFieldNotIdentity_1 = __importDefault(require("./belongsToMany/usingBackFieldNotIdentity"));
const usingEntityNotFound_1 = __importDefault(require("./belongsToMany/usingEntityNotFound"));
const usingFieldNotExists_1 = __importDefault(require("./belongsToMany/usingFieldNotExists"));
const usingFieldsCheck_1 = __importDefault(require("./belongsToMany/usingFieldsCheck"));
const usingNotExists_1 = __importDefault(require("./belongsToMany/usingNotExists"));
const notCompatibleRelationEnds_1 = __importDefault(require("./common/notCompatibleRelationEnds"));
const oppositeNotFound_1 = __importDefault(require("./common/oppositeNotFound"));
const ownerFieldUnnecesseryIndexed_1 = __importDefault(require("./common/ownerFieldUnnecesseryIndexed"));
const possibleOppositeNotFound_1 = __importDefault(require("./common/possibleOppositeNotFound"));
const refBackFieldNotExists_2 = __importDefault(require("./common/refBackFieldNotExists"));
const refBackFieldNotIdentity_1 = __importDefault(require("./common/refBackFieldNotIdentity"));
const refEntityNotFound_2 = __importDefault(require("./common/refEntityNotFound"));
const refFieldNotFound_1 = __importDefault(require("./common/refFieldNotFound"));
const refFieldNotIndexed_1 = __importDefault(require("./common/refFieldNotIndexed"));
exports.common = [
    new refFieldNotFound_1.default(),
    new notCompatibleRelationEnds_1.default(),
    new oppositeNotFound_1.default(),
    new possibleOppositeNotFound_1.default(),
];
exports.belongsTo = [
    new refBackFieldNotIndexed_1.default(),
    new ownerFieldIsIdentity_1.default(),
    new ownerFieldNotIndexed_1.default(),
    new refBackFieldNotExists_1.default(),
    new refBackFieldIsIdentity_1.default(),
    new refEntityNotFound_2.default(),
    new refFieldNotIdentity_1.default(),
];
exports.belongsToMany = [
    new refEntityNotFound_1.default(),
    new ownerFieldUnnecesseryIndexed_1.default(),
    new refFieldNotIdentity_1.default(),
    new refBackFieldNotIdentity_1.default(),
    new refBackFieldNotExists_2.default(),
    new usingBackFieldNotExists_1.default(),
    new usingBackFieldNotIdentity_1.default(),
    new usingEntityNotFound_1.default(),
    new usingFieldNotExists_1.default(),
    new usingFieldsCheck_1.default(),
    new usingNotExists_1.default(),
];
exports.hasOne = [
    new refEntityNotFound_2.default(),
    new ownerFieldUnnecesseryIndexed_1.default(),
    new refBackFieldNotIdentity_1.default(),
    new refBackFieldNotExists_2.default(),
    new refFieldNotIndexed_1.default(),
];
exports.hasMany = [
    new refEntityNotFound_2.default(),
    new ownerFieldUnnecesseryIndexed_1.default(),
    new refBackFieldNotIdentity_1.default(),
    new refBackFieldNotExists_2.default(),
    new refFieldNotIndexed_1.default(),
];
//# sourceMappingURL=index.js.map