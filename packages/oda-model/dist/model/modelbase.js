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
const inflected = __importStar(require("inflected"));
const clean_1 = __importDefault(require("../lib/json/clean"));
const fold_1 = __importDefault(require("./../lib/json/fold"));
const metadata_1 = require("./metadata");
class ModelBase extends metadata_1.Metadata {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.updateWith(fold_1.default(obj));
        }
    }
    get name() {
        return this.$obj.name;
    }
    get title() {
        return this.$obj.title;
    }
    get description() {
        return this.$obj.description;
    }
    toString() {
        return JSON.stringify(this.toObject());
    }
    toObject(modelPackage) {
        let props = this.$obj;
        return clean_1.default(Object.assign({}, super.toObject(), { name: props.name, title: props.title, description: props.description }));
    }
    toJSON(modelPackage) {
        let props = this.$obj;
        return clean_1.default(Object.assign({}, super.toJSON(), { name: props.name_, title: props.title_, description: props.description_ }));
    }
    updateWith(obj) {
        if (obj) {
            super.updateWith(obj);
            const result = Object.assign({}, this.$obj);
            let $name = obj.name;
            let $title = obj.title;
            let $description = obj.description;
            let name = inflected.camelize($name.trim(), false);
            let title = $title ? $title.trim() : '';
            let description = $description ? $description.trim() : '';
            if (!title) {
                title = inflected.titleize(name);
            }
            if (!description) {
                description = title || $title;
            }
            description = inflected.titleize(description);
            result.name_ = $name;
            result.name = name;
            result.title_ = $title;
            result.title = title;
            result.description_ = $description;
            result.description = description;
            this.$obj = result;
        }
    }
    clone() {
        return new this.constructor(this.toJSON());
    }
}
exports.ModelBase = ModelBase;
//# sourceMappingURL=modelbase.js.map