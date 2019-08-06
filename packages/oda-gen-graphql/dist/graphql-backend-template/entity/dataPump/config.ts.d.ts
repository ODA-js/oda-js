import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/dataPump/config.ts.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    plural: string;
    dcPlural: string;
    ownerFieldName: string;
    complexUnique: {
        name: string;
        fields: {
            name: string;
            uName: string;
        }[];
    }[];
    unique: {
        name: string;
        cName: string;
        type: string;
    }[];
    fields: {
        name: string;
    }[];
    relations: {
        derived: boolean;
        persistent: boolean;
        field: string;
        single: boolean;
        name: string;
        ref: {
            entity: string;
        };
    }[];
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=config.ts.d.ts.map