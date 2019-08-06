import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
export declare const template = "entity/mutations/resolver.ts.njs";
export declare function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): any;
export interface MapperOutput {
    name: string;
    ownerFieldName: string;
    complexUnique: {
        name: string;
        fields: {
            name: string;
            uName: string;
            type: string;
        }[];
    }[];
    relEntities: any[];
    relations: {
        derived: boolean;
        persistent: boolean;
        field: string;
        single: boolean;
        name: string;
        fields: any[];
        ref: {
            entity: string;
            fieldName: string;
        };
    }[];
    fields: {
        name: string;
    }[];
    persistent: {
        derived: boolean;
        persistent: boolean;
        field: string;
        single: boolean;
        name: string;
        ref: {
            entity: string;
            fieldName: string;
        };
    }[];
    args: {
        create: {
            args: {
                name: string;
                type: string;
            }[];
            find: {
                name: string;
                type: string;
            }[];
        };
        update: {
            args: {
                name: string;
                type: string;
            }[];
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
            args: {
                name: string;
                type: string;
            }[];
            find: {
                name: string;
                type: string;
                cName: string;
            }[];
        };
    };
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=resolver.ts.d.ts.map