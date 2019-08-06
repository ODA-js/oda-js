"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const authenticateAsAnonymous_1 = require("./authenticateAsAnonymous");
const queryAuthToken_1 = require("./queryAuthToken");
const passport_http_bearer_1 = require("passport-http-bearer");
const verifyToken_1 = require("./verifyToken");
exports.default = (express, passport, getUserById) => {
    passport.use(new authenticateAsAnonymous_1.Strategy());
    passport.use(new queryAuthToken_1.Strategy((token, done) => {
        return verifyToken_1.verifyToken(getUserById, token)
            .then(u => done(null, u, token))
            .catch(e => done(e));
    }));
    passport.use(new passport_http_bearer_1.Strategy((token, done) => {
        return verifyToken_1.verifyToken(getUserById, token)
            .then(u => done(null, u, token))
            .catch(e => done(e));
    }));
    express.use(body_parser_1.urlencoded({ extended: false }));
    express.use(passport.initialize());
    express.use(passport.authenticate(['bearer', 'authenticate-query-auth-token', 'authenticate-as-anonymous'], { session: false }));
};
//# sourceMappingURL=init.js.map