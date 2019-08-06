"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fte_js_1 = require("fte.js");
function default_1({ root }) {
    return new fte_js_1.Factory({
        ext: ['njs'],
        root,
        preload: true,
        debug: true,
    });
}
exports.default = default_1;
//# sourceMappingURL=templateEngine.js.map