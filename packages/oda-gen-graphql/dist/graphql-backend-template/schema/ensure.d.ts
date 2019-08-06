import { Entity, ModelPackage, FieldType } from 'oda-model';
export declare const mapper: (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
export declare function _mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: FieldType) => string;
}, adapter: string): {
    name: any;
    findQuery: string;
    ownerFieldName: string;
    fields: any;
    unique: {
        find: any[];
        complex: {
            name: any;
            fields: {
                name: any;
                uName: string;
                type: string;
            }[];
        }[];
    };
};
//# sourceMappingURL=ensure.d.ts.map