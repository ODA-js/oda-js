import { GeneratorConfig } from './interfaces';
import AclDefault from '../acl';
export declare function ensureConfigValues(cp: any, pname: any): any;
export declare function fill(src: Object, value: any): {};
export declare function traversePackage(src: any, origin: any): any;
export declare const expandConfig: (config: any, packages: string[]) => GeneratorConfig;
export interface IPackageDef {
    [security: string]: {
        acl: number;
        entities: {
            [name: string]: boolean;
        };
        mutations: {
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
//# sourceMappingURL=utils.d.ts.map