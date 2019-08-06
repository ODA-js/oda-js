"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mutation => (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
    const needCommit = yield context.connectors.ensureTransaction();
    const txn = yield context.connectors.transaction;
    try {
        const payload = (yield mutation(root, args, context, info)) || {};
        if (needCommit) {
            return txn.commit().then(() => payload);
        }
        else {
            return payload;
        }
    }
    catch (e) {
        yield txn.abort();
        throw e;
    }
});
//# sourceMappingURL=mutateSafe.js.map