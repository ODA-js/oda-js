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
exports.default = {
    getInfo(info) {
        console.warn('info =>>>>>', info);
        return {
            fieldName: info.fieldName,
            typeName: info.parentType.name,
            operation: {
                type: info.operation ? info.operation.operation : '',
                name: info.operation && info.operation.name
                    ? info.operation.name.value
                    : '',
            },
            path: info.path,
            variables: info.variableValues ? info.variableValues.input_0 : {},
        };
    },
    canAccess(root, args, context, info) {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn('info====>>>>> ', info);
            console.warn(this.getInfo(info));
            return true;
        });
    },
};
//# sourceMappingURL=securityLayer.js.map