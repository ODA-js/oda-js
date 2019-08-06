import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/type/entry.graphql.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    description: string;
    implements: string[];
    filter: string[];
    filterSubscriptions: string[];
    filterEmbed: string[];
    fields: {
        name: string;
        description: string;
        type: string;
        args: string;
    }[];
    relations: {
        entity: string;
        name: string;
        description: string;
        type: string;
        connectionName: string;
        single: boolean;
        embedded: boolean;
        args: string;
    }[];
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=entry.graphql.d.ts.map