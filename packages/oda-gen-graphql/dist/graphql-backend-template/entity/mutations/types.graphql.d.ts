import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/mutations/types.graphql.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    plural: string;
    payloadName: string;
    relations: {
        derived: boolean;
        persistent: boolean;
        field: string;
        embedded: boolean;
        single: boolean;
        fields: any[];
        ref: {
            entity: string;
            eEntity: MapperOutput;
        };
    }[];
    create: {
        name: string;
        type: string;
    }[];
    update: {
        name: string;
        type: string;
    }[];
    unique: {
        name: string;
        type: string;
    }[];
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=types.graphql.d.ts.map