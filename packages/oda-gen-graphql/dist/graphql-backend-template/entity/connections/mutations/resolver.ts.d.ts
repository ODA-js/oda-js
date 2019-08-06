import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/connections/mutations/resolver.ts.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    ownerFieldName: string;
    embedded: string[];
    connections: {
        opposite: string;
        relationName: string;
        name: string;
        refEntity: string;
        addArgs: {
            name: string;
            type: string;
        }[];
        removeArgs: {
            name: string;
            type: string;
        }[];
        ref: {
            fields: string[];
        };
        single: boolean;
        embedded?: boolean | string;
    }[];
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=resolver.ts.d.ts.map