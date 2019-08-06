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
const oda_isomorfic_1 = require("oda-isomorfic");
exports.default = mutation => (root, { input }, context, info) => __awaiter(this, void 0, void 0, function* () {
    const payload = (yield mutation(input, context, info)) || {};
    payload.clientMutationId = input.clientMutationId;
    if (context.user) {
        payload.viewer = {
            id: oda_isomorfic_1.fromGlobalId(context.user.id).id,
        };
    }
    return payload;
});
//# sourceMappingURL=mutateAndGetPayload.js.map