"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Strategy {
    constructor(verify) {
        this.name = 'authenticate-query-auth-token';
        this._verify = verify;
    }
    success(user, info) {
        return;
    }
    fail() {
        return;
    }
    error(user, info) {
        return;
    }
    pass() {
        return;
    }
    authenticate(req, res) {
        let token = req.query.authToken;
        if (token) {
            this._verify(token, (err, user) => {
                if (err) {
                    return this.error(err);
                }
                if (user) {
                    this.success(user);
                }
                else {
                    this.fail();
                }
            });
        }
        else {
            this.fail();
        }
    }
}
exports.Strategy = Strategy;
//# sourceMappingURL=queryAuthToken.js.map