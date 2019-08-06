import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/connections/types.graphql.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    plural: string;
    connections: {
        connectionName: string;
        refType: string;
        fields: {
            name: string;
            description: string;
            type: string;
            argsString: string;
        }[];
    }[];
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=types.graphql.d.ts.map