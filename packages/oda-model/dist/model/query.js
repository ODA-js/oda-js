"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const modelbase_1 = require("./modelbase");
class Query extends modelbase_1.ModelBase {
    get args() {
        return this.$obj.args_;
    }
    get payload() {
        return this.$obj.payload_;
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            let args = obj.args;
            let $args = obj.args;
            let payload = obj.payload;
            let $payload = obj.payload;
            result.args = args;
            result.args_ = $args;
            result.payload = payload;
            result.payload_ = $payload;
            this.$obj = result;
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { args: props.args ? props.args : undefined, payload: props.payload ? props.payload : undefined }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { args: props.args_ ? props.args_ : undefined, payload: props.payload_ ? props.payload_ : undefined }));
    }
}
exports.Query = Query;
//# sourceMappingURL=query.js.map