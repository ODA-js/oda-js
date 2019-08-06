"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(args) {
    let result = { limit: 0, skip: 0 };
    if (args.first || args.after) {
        result.limit = args.first || result.limit;
        if (args.after) {
            result.after = args.after;
        }
    }
    else if (args.last || args.before) {
        result.limit = args.last || result.limit;
        if (args.before) {
            result.before = args.before;
        }
    }
    else if (args.limit || args.skip) {
        result.limit = args.limit || result.limit;
        result.skip = args.skip || result.skip;
    }
    return result;
}
exports.default = default_1;
//# sourceMappingURL=pagination.js.map