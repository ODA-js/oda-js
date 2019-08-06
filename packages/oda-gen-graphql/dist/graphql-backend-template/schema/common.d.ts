import { Entity, ModelPackage, FieldType } from 'oda-model';
export declare const template = "schema/common.ts.njs";
declare type MapperOutput = {};
export declare function prepare(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): {
    ctx: MapperOutput;
    template: string;
};
export declare type ACLInput = {
    create: string | string[];
    read: string | string[];
    update: string | string[];
    delete: string | string[];
    subscribe: string | string[];
    type: string | string[];
    relations?: {
        [relation: string]: string | string[] | {
            query: string | string[];
            mutate: string | string[];
        };
    } | boolean;
    fields?: {
        [relation: string]: string | string[] | {
            query: string | string[];
            mutate: string | string[];
        };
    } | boolean;
};
export declare type ACLOutput = {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    subscribe: boolean;
    type: boolean;
    relations?: {
        [relation: string]: boolean | {
            query: boolean;
            mutate: boolean;
            embed: boolean;
        };
    } | boolean;
    fields?: {
        [relation: string]: boolean | {
            query: boolean;
            mutate: boolean;
        };
    } | boolean;
};
export declare function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): MapperOutput;
export {};
//# sourceMappingURL=common.d.ts.map