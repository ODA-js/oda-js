"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secureAny_1 = require("./secureAny");
class SecureMutation extends secureAny_1.Secure {
    constructor(args) {
        super(args);
        this.userGroup = args.userGroup;
        if (!this.userGroup) {
            this.userGroup = context => context.user.profileName;
        }
    }
    getMutationInfo(info) {
        return {
            opType: info.operation ? info.operation.operation : '',
            name: info.fieldName,
        };
    }
    secureMutation() {
        const getMutationInfo = this.getMutationInfo.bind(this);
        const allow = this.allow.bind(this);
        const getACLGroup = this.userGroup;
        return (source, args, context, info) => {
            const group = getACLGroup(context);
            let descriptor = getMutationInfo(info);
            if (descriptor.opType === 'mutation') {
                if (!allow(group, descriptor.name)) {
                    throw new Error('operation not allowed');
                }
            }
            if (descriptor.opType === 'subscription') {
                return source;
            }
        };
    }
}
exports.SecureMutation = SecureMutation;
//# sourceMappingURL=secureMutations.js.map