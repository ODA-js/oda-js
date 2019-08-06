import { Entity, ModelPackage, FieldType } from 'oda-model';
export interface UIView {
    listName: string[];
    quickSearch: string[];
    hidden?: {
        [key: string]: boolean;
    };
    edit?: {
        [key: string]: boolean;
    };
    show?: {
        [key: string]: boolean;
    };
    list?: {
        [key: string]: boolean;
    };
    embedded?: {
        [key: string]: string;
    };
}
export interface MapperOutput {
    dictionary: boolean;
    packageName: string;
    role: string;
    name: string;
    implements: string[];
    embedded: boolean | string[];
    abstract: boolean;
    title: string;
    titlePlural: string;
    UI: UIView;
    plural: string;
    listLabel: string[];
    listName: string;
    ownerFieldName: string;
    relations: {
        inheritedFrom?: string;
        required: boolean;
        derived: boolean;
        persistent: boolean;
        field: string;
        single: boolean;
        name: string;
        ref: {
            entity: string;
            fieldName: string;
            listLabel: {
                type: string;
                source: any;
            };
        };
    }[];
    fields: {
        inheritedFrom?: string;
        name: string;
        required: boolean;
    }[];
    props: {
        inheritedFrom?: string;
        order: string;
        required: boolean;
    }[];
    actions?: {
        name: string;
        title: string;
        actionType: string;
    }[];
    enum?: any;
}
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}): MapperOutput;
//# sourceMappingURL=common.d.ts.map