import { CRUD } from './../connector';
export declare type ACLCRUD<T> = {
    [k in CRUD]: Secure<T>;
};
export interface Acl<T> {
    [mutationMask: string]: T;
}
export interface Acls<T> {
    [group: string]: Acl<T> | T;
}
export interface Rules {
    [group: string]: {
        match: RegExp;
        key: string;
    }[];
}
export declare class Secure<T> {
    acl: Acls<T>;
    rules: Rules;
    defaultAccess: T;
    constructor({ acls }: {
        acls: Acls<T>;
    });
    allow(accessGroup: string, accessObject: string): T;
}
//# sourceMappingURL=secureAny.d.ts.map