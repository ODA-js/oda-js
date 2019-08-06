import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/subscriptions/resolver.ts.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    ownerFieldName: string;
    unionCheck: string[];
    connections: {
        refFieldName: string;
        name: string;
        fields: {
            name: string;
            type: string;
        }[];
    }[];
    relations: any;
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=resolver.ts.d.ts.map