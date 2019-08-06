export declare const resetCache: () => void;
export declare const getPackages: (model: any) => unknown[];
export declare const getRealEntities: (pack: any) => unknown[];
export declare const getUIEntities: (pack: any) => unknown[];
export declare const getScalars: (pack: any) => unknown[];
export declare const getDirvectives: (pack: any) => unknown[];
export declare const getEnums: (pack: any) => unknown[];
export declare const getUnions: (pack: any) => unknown[];
export declare const getMixins: (pack: any) => unknown[];
export declare const fields: (f: any) => boolean;
export declare const relations: (f: any) => boolean;
export declare const getMutations: (pack: any) => any[];
export declare const getQueries: (pack: any) => any[];
export declare const canUpdateBy: (f: any) => boolean;
export declare const oneUniqueInIndex: (entity: any) => (f: any) => boolean;
export declare const oneFieldIndex: (entity: any) => (f: any) => boolean;
export declare const complexUniqueIndex: (entity: any) => any[];
export declare const complexUniqueFields: (entity: any) => any;
export declare const _getFieldNames: (entity: any) => string[];
export declare const getFieldNames: (entity: any) => any;
export declare const getOrderBy: (role: string) => (allow: any, entity: any) => any;
export declare const searchParamsForAcl: (allow: any, role: string, entity: any) => any;
export declare const _filterForAcl: (role: string, pack: any) => (allow: any, entity: any) => string[];
export declare const filterForAcl: (role: string, pack: any) => any;
export declare const getRelationNames: (entity: any) => unknown[];
export declare const derivedFields: (f: any) => boolean;
export declare const derivedFieldsAndRelations: (f: any) => boolean;
export declare const _getFields: (entity: any) => any[];
export declare const getFields: (entity: any) => any[];
export declare const idField: (f: any) => boolean;
export declare const _getFieldsForAcl: (role: string, pack: any) => (allow: any, entity: any) => any[];
export declare const getFieldsForAcl: (role: string, pack: any) => any;
export declare const relationFieldsExistsIn: (pack: any) => (f: any) => boolean;
export declare const persistentFields: (f: any) => boolean;
export declare const indexedFields: (f: any) => boolean;
export declare const indexedRelations: (f: any) => boolean;
export declare const identityFields: (f: any) => boolean;
export declare const mutableFields: (f: any) => boolean;
export declare const nonIdFields: (f: any) => boolean;
export declare const getUniqueFieldNames: (entity: any) => any[];
export declare const indexes: (e: any) => any[];
export declare const singleStoredRelationsExistingIn: (pack: any) => (f: any) => boolean;
export declare const storedRelationsExistingIn: (pack: any) => (f: any) => boolean;
export declare const persistentRelations: (pack: any) => (f: any) => any;
export declare const memoizeEntityMapper: (name: any, mapper: any) => (entity: any, pack: any, role: string, aclAllow: any, typeMapper: {
    [key: string]: (i: any) => string;
}, defaultAdapter?: string) => any;
//# sourceMappingURL=queries.d.ts.map