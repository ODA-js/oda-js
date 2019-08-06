"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userAnonymous_1 = __importDefault(require("./userAnonymous"));
class Strategy {
    constructor() {
        this.name = 'authenticate-as-anonymous';
    }
    success(user, info) {
        return;
    }
    authenticate() {
        this.success(userAnonymous_1.default());
    }
}
exports.Strategy = Strategy;
//# sourceMappingURL=authenticateAsAnonymous.js.map