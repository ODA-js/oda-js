"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AclDefault {
    constructor(roles = ['system']) {
        this.roles = roles;
    }
    allow(role, access) {
        if (Array.isArray(access)) {
            return access.some(r => r === role);
        }
        else {
            return access === role;
        }
    }
}
exports.default = AclDefault;
//# sourceMappingURL=acl.js.map