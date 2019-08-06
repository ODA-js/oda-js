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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verifyToken = (getUserById, token) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        jsonwebtoken_1.default.verify(token, config_1.default.get('passport.secret'), (jwtError, decoded) => __awaiter(this, void 0, void 0, function* () {
            if (!jwtError) {
                let user = yield getUserById(decoded.data);
                if (!user || (user && !user.enabled)) {
                    return res(false);
                }
                return res(user);
            }
            else {
                return res(false);
            }
        }));
    });
});
//# sourceMappingURL=verifyToken.js.map