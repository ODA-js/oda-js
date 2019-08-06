"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const entry = __importStar(require("./entry.graphql"));
exports.entry = entry;
const types = __importStar(require("./types.graphql"));
exports.types = types;
const resolver = __importStar(require("./resolver.ts"));
exports.resolver = resolver;
const index = __importStar(require("./mutation.index.ts"));
exports.index = index;
//# sourceMappingURL=index.js.map