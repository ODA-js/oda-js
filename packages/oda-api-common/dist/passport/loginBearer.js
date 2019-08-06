"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const utils_1 = require("./utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.loginBearer = (payload, password, salt, hash) => __awaiter(this, void 0, void 0, function* () {
    if (!utils_1.verifyPasswordWithSalt(password, salt, hash)) {
        return Promise.reject(new Error('failed'));
    }
    return jsonwebtoken_1.default.sign({
        data: payload,
    }, config_1.default.get('passport.secret'), { expiresIn: config_1.default.get('passport.expiresIn') });
});
//# sourceMappingURL=loginBearer.js.map