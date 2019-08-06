import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/type/resolver.ts.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    adapter: string;
    description: string;
    ownerFieldName: string;
    fields: any;
    relations: {
        derived: boolean;
        field: string;
        refFieldName: string;
        name: string;
        verb: string;
        idMap: string[];
        embedded: boolean;
        single: boolean;
        ref: {
            backField: string;
            usingField: string;
            usingIndex: string;
            field: string;
            cField: string;
            entity: string;
            fields: string[];
            using: {
                backField: string;
                entity: string;
                field: string;
            };
        };
    }[];
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): MapperOutput;
//# sourceMappingURL=resolver.ts.d.ts.map