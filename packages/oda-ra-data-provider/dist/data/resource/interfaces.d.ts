import { queries } from './consts';
export declare type ResponseFunction = (response: {
    data: any;
}, params: any) => {
    data: any;
};
export declare type UpdateFunction = (store: any, response: any) => void;
export declare type VariablesFunction = (params: any) => any;
export declare type OrderByFunction = (field: any) => string | undefined;
export declare type FilterByFunction = (field: any, oparation: IResourceOperation) => object | undefined;
export declare type ReFetchQueriesFunction = (variables: any) => any;
export declare type ShouldFakeExecuteFunction = ((variables: {
    input: object;
    files: any;
}) => boolean | object) | boolean;
export declare type FetchPolicyFunction = (params: any) => any;
export declare enum refType {
    HasMany = "HasMany",
    HasOne = "HasOne",
    BelongsTo = "BelongsTo",
    BelongsToMany = "BelongsToMany"
}
export declare enum fieldType {
    number = "number",
    string = "string",
    date = "date",
    boolean = "boolean"
}
export interface IResourceReference {
    type: refType;
    embedded?: boolean;
    resource: string;
}
export interface IField {
    ref: IResourceReference;
    type: fieldType;
}
export interface INamedField extends IField {
    name: string;
}
export declare type FieldsDefinition = {
    [name: string]: IField;
};
export declare type FragmentsDefinitions = {
    [name: string]: any;
};
export interface IResourceFields {
    fields: FieldsDefinition;
}
export interface IResourceOperationsDefinition {
    GET_LIST?: IResourceOperation;
    GET_ONE?: IResourceOperation;
    CREATE?: IResourceOperation;
    UPDATE?: IResourceOperation;
    DELETE?: IResourceOperation;
    GET_MANY?: IResourceOperation;
    GET_MANY_REFERENCE?: IResourceOperation;
}
export interface IResourceQueryDefinitions {
    getList: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getOne: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getMany: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    delete: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    create: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    update: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getManyReference: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getListResult: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getOneResult: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getManyResult: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    deleteResult: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    createResult: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    updateResult: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getManyReferenceResult: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getManyReferenceResultOpposite: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
    getManyReferenceResultRegular: (fragments: FragmentsDefinitions, queries: IResourceQueryDefinitions) => any;
}
export interface IResourceDefinition {
    name: string;
    fields: FieldsDefinition;
    operations: IResourceOperationsDefinition;
    queries: IResourceQueryDefinitions;
    fragments: (frg: {
        [key: string]: FragmentsDefinitions;
    }) => FragmentsDefinitions;
}
export interface IResourceOperationDefinition {
    parseResponse?: ResponseFunction;
    update?: UpdateFunction;
    variables?: VariablesFunction;
    fetchPolicy?: string | FetchPolicyFunction;
    orderBy?: OrderByFunction;
    filterBy?: FilterByFunction;
    reFetchQueries?: ReFetchQueriesFunction;
    shouldFakeExecute?: ShouldFakeExecuteFunction;
}
export interface IResource extends IResourceDefinition {
    name: string;
    fields: FieldsDefinition;
    operations: IResourceOperationsDefinition;
    queries: IResourceQueryDefinitions;
    fragments: (frg: {
        [key: string]: FragmentsDefinitions;
    }) => FragmentsDefinitions;
    resourceContainer: IResourceContainer;
    override: (overrides: IResourceDefinition) => IResource;
    connect: (resourceContainer: IResourceContainer) => IResource;
}
export interface IResourceContainer {
    register: (resource: IResourceDefinition) => void;
    override: (resource: IResourceDefinition) => void;
    queries: (resource: string, query: queries) => any;
    fragments: {
        [fragments: string]: IResource;
    };
    resource(resource: string): any;
}
export interface IResourceOperation extends IResourceOperationDefinition {
    resource: IResource;
    query: any;
    resultQuery: any;
    parseResponse: ResponseFunction;
    update: UpdateFunction;
    variables: VariablesFunction;
    type: queries;
    fetchPolicy: string | FetchPolicyFunction;
    orderBy: OrderByFunction;
    filterBy: FilterByFunction;
    reFetchQueries: ReFetchQueriesFunction;
    override: (overrides: IResourceOperationDefinition) => IResourceOperation;
    connect: (resource: IResource) => IResourceOperation;
}
//# sourceMappingURL=interfaces.d.ts.map