"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("config"));
exports.hashPassword = password => {
    let salt = crypto_1.default.randomBytes(16).toString('base64');
    let hash = crypto_1.default
        .pbkdf2Sync(password, salt + config_1.default.get('passport.salt2'), 10000, 512, 'sha512')
        .toString('base64');
    return { salt, hash };
};
exports.verifyPasswordWithSalt = (password, salt, hash) => {
    return (hash ===
        crypto_1.default
            .pbkdf2Sync(password, salt + config_1.default.get('passport.salt2'), 10000, 512, 'sha512')
            .toString('base64'));
};
//# sourceMappingURL=utils.js.map