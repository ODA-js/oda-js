"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const deepMerge_1 = __importDefault(require("./../lib/json/deepMerge"));
const get_1 = __importDefault(require("./../lib/json/get"));
const set_1 = __importDefault(require("./../lib/json/set"));
class Metadata {
    validate(validator) {
        return validator.check(this);
    }
    constructor(inp) {
        if (inp && inp.metadata) {
            this.setMetadata('*', inp.metadata);
        }
    }
    getMetadata(key, def) {
        if (!key) {
            return this.metadata;
        }
        else {
            let result = get_1.default(this.metadata, key);
            if (result === undefined && def !== undefined) {
                this.setMetadata(key, def);
            }
            return result !== undefined ? result : def;
        }
    }
    hasMetadata(key) {
        if (key) {
            return !!get_1.default(this.metadata, key);
        }
        else {
            return false;
        }
    }
    setMetadata(key, data) {
        if (typeof key !== 'string' && !data) {
            data = key;
            key = '*';
        }
        if (data !== undefined) {
            if (key === '*') {
                this.metadata = data;
            }
            else {
                if (!this.metadata) {
                    this.metadata = {};
                }
                set_1.default(this.metadata, key, data);
            }
        }
    }
    updateWith(obj) {
        if (obj && obj.metadata) {
            this.metadata = deepMerge_1.default(this.metadata || {}, obj.metadata);
        }
    }
    toObject() {
        return clean_1.default({
            metadata: this.metadata,
        });
    }
    toJSON() {
        return clean_1.default({
            metadata: this.metadata,
        });
    }
}
exports.Metadata = Metadata;
//# sourceMappingURL=metadata.js.map