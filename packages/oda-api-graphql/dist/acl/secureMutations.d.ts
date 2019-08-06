import { Secure } from './secureAny';
export declare class SecureMutation extends Secure<boolean> {
    userGroup: (context: any) => string;
    constructor(args: any);
    getMutationInfo(info: any): {
        opType: any;
        name: any;
    };
    secureMutation(): (source: any, args: any, context: any, info: any) => any;
}
//# sourceMappingURL=secureMutations.d.ts.map