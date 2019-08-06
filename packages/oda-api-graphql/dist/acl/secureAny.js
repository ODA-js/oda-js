"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Secure {
    constructor({ acls = {} }) {
        this.defaultAccess = acls['*'];
        this.acl = acls;
        this.rules = {};
        Object.keys(acls)
            .filter(o => o !== '*')
            .forEach(i => {
            let rule = acls[i];
            this.rules[i] = Object.keys(rule)
                .filter(o => o !== '*')
                .map(o => ({ match: new RegExp(o, 'ig'), key: o }));
        });
    }
    allow(accessGroup, accessObject) {
        if (this.acl[accessGroup]) {
            let result = (this.acl[accessGroup] && this.acl[accessGroup]['*']) ||
                this.defaultAccess;
            let last = '';
            let found = this.rules[accessGroup].some(r => {
                last = r.key;
                return !!accessObject.match(r.match);
            });
            if (found) {
                result = this.acl[accessGroup][last];
            }
            return result;
        }
        else {
            return this.defaultAccess;
        }
    }
}
exports.Secure = Secure;
//# sourceMappingURL=secureAny.js.map