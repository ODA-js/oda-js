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
    description: string;
    unique: string[];
    complexUniqueIndex: any[];
    loaders: any[];
    fields: string[];
    embedded: string[];
    filterAndSort: {
        type: string;
        name: string;
        gqlType: string;
    }[];
    search: {
        type: string;
        name: string;
        gqlType: string;
        rel: boolean;
        _name?: string;
    }[];
    updatableRels: string[];
    ownerFieldName: string;
    cOwnerFieldName: string;
    args: {
        create: {
            name: string;
            type: string;
        }[];
        update: {
            find: {
                name: string;
                type: string;
                cName: string;
            }[];
            payload: {
                name: string;
                type: string;
            }[];
        };
        remove: {
            name: string;
            type: string;
            cName: string;
        }[];
        getOne: {
            name: string;
            type: string;
            cName: string;
        }[];
    };
    relations: {
        field: string;
        relationName: string;
        verb: string;
        addArgs: {
            name: string;
            type: string;
        }[];
        removeArgs: {
            name: string;
            type: string;
        }[];
        ref: {
            backField: string;
            usingField: string;
            field: string;
            entity: string;
            fields: string[];
            using: {
                backField: string;
                entity: string;
                field: string;
            };
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
}, adapter?: string): MapperOutput;
//# sourceMappingURL=connector.ts.d.ts.map