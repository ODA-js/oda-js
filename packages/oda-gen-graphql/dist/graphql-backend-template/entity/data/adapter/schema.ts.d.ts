import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template: {
    mongoose: string;
    sequelize: string;
};
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter?: string): any;
export interface MapperOutput {
    name: string;
    plural?: string;
    strict: boolean | undefined;
    collectionName: string;
    description?: string;
    useDefaultPK: boolean;
    fields: {
        name: string;
        type: string;
        required?: boolean;
    }[];
    embedded: string[];
    relations: {
        name: string;
        type: string;
        single: boolean;
        embedded?: boolean | string;
        required?: boolean;
        primaryKey?: boolean;
    }[];
    indexes?: {
        fields: object;
        options: object;
    }[] | object;
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): MapperOutput;
//# sourceMappingURL=schema.ts.d.ts.map