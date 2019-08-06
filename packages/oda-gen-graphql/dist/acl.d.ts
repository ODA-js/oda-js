export default class AclDefault {
    readonly roles: string[];
    constructor(roles?: string[]);
    allow(role: string, access: string | string[]): boolean;
}
//# sourceMappingURL=acl.d.ts.map