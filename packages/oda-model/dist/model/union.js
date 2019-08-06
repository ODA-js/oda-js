"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clean_1 = __importDefault(require("../lib/json/clean"));
const modelbase_1 = require("./modelbase");
class Union extends modelbase_1.ModelBase {
    constructor() {
        super(...arguments);
        this.modelType = 'union';
    }
    get items() {
        return this.$obj.items;
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            result.name = obj.name;
            let $items = obj.items;
            let items = $items;
            result.items = items;
            result.items_ = $items;
            this.$obj = result;
        }
    }
    toObject() {
        let props = this.$obj;
        let res = super.toObject();
        return clean_1.default(Object.assign({}, res, { items: props.items || props.items_ }));
    }
    toJSON() {
        let props = this.$obj;
        let res = super.toJSON();
        return clean_1.default(Object.assign({}, res, { items: props.items_ }));
    }
}
exports.Union = Union;
//# sourceMappingURL=union.js.map