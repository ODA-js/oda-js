"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_1 = __importDefault(require("./get"));
const set_1 = __importDefault(require("./set"));
function deepMerge(...args) {
    if (args.length > 0) {
        let result = new args[0].constructor();
        let array = Array.isArray(result);
        for (let i = 0, len = args.length; i < len; i++) {
            let current = args[i];
            if (current !== undefined) {
                if (!array) {
                    let keys = Object.keys(current);
                    for (let j = 0, kLen = keys.length; j < kLen; j++) {
                        let key = keys[j];
                        if (current.hasOwnProperty(key)) {
                            let cv = get_1.default(current, key);
                            if (result.hasOwnProperty(key) &&
                                typeof cv === 'object' &&
                                cv !== null) {
                                set_1.default(result, key, deepMerge(get_1.default(result, key), cv));
                            }
                            else {
                                set_1.default(result, key, cv);
                            }
                        }
                    }
                }
                else {
                    if (Array.isArray(current)) {
                        result = [...result, ...current];
                    }
                    else {
                        result.push(current);
                    }
                }
            }
        }
        return result;
    }
    else {
        return args[0];
    }
}
exports.default = deepMerge;
//# sourceMappingURL=deepMerge.js.map