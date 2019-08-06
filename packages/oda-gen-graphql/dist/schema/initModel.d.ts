import AclDefault from '../acl';
export interface IPackageDef {
    [security: string]: {
        acl: number;
        entities: {
            [name: string]: boolean;
        };
        mutations: {
            [name: string]: boolean;
        };
        queries: {
            [name: string]: boolean;
        };
        enums: {
            [name: string]: boolean;
        };
        mixins: {
            [name: string]: boolean;
        };
        unions: {
            [name: string]: boolean;
        };
        scalars: {
            [name: string]: boolean;
        };
        directives: {
            [name: string]: boolean;
        };
    };
}
export declare function initPackages(secureAcl: AclDefault): IPackageDef;
export declare function pushToAppropriate({ item, acl, path, packages, }: {
    item: {
        name: string;
    };
    acl: string | string[];
    path: string;
    packages: IPackageDef;
}): void;
export default function ({ schema, hooks, secureAcl, packageList, }: {
    [keys: string]: any;
    secureAcl: AclDefault;
}): {
    modelStore: any;
    packages: Map<unknown, unknown>;
};
//# sourceMappingURL=initModel.d.ts.map