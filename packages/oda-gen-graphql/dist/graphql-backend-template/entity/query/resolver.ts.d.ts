import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/query/resolver.ts.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): any;
export interface MapperOutput {
    name: string;
    singular: string;
    plural: string;
    unique: {
        args: {
            name: string;
            type: string;
        }[];
        find: {
            name: string;
            type: string;
            cName: string;
        }[];
        complex: {
            name: string;
            fields: {
                name: string;
                uName: string;
                type: string;
                gqlType?: string;
            }[];
        }[];
    };
    adapter: string;
    idMap: string[];
    relations: {
        derived: boolean;
        field: string;
        refFieldName: string;
        name: string;
        verb: string;
        ref: {
            backField: string;
            usingField: string;
            field: string;
            type: string;
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