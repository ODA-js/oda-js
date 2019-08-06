"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = __importDefault(require("./resource"));
class default_1 {
    constructor(options) {
        this.fragments = {};
        this.resources = {};
        if (Array.isArray(options)) {
            options.forEach(this.register.bind(this));
        }
        else if (options) {
            this.register(options);
        }
    }
    register(resource) {
        if (Array.isArray(resource)) {
            resource.forEach(this.register.bind(this));
        }
        else if (resource) {
            this.resources[resource.name] =
                resource instanceof resource_1.default
                    ? resource.connect(this)
                    : new resource_1.default({ overrides: resource, resourceContainer: this });
            this.fragments = Object.assign({}, this.fragments, resource.fragments);
        }
    }
    override(resource) {
        if (Array.isArray(resource)) {
            resource.forEach(this.override.bind(this));
        }
        else if (resource) {
            let res = this.resources[resource.name];
            if (!res) {
                this.register(resource);
            }
            else {
                res.override(resource);
            }
        }
    }
    queries(resource, query) {
        return this.resource(resource).operations[query];
    }
    resource(resource) {
        return this.resources[resource];
    }
}
exports.default = default_1;
//# sourceMappingURL=resourceContainer.js.map