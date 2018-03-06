import { queries } from './consts';

export type ResponseFunction = (response: { data: any }, params: any) => { data: any };
export type UpdateFunction = (store, response) => void;
export type VariablesFunction = (params: any) => any;
export type OrderByFunction = (field) => string | undefined;
export type FilterByFunction = (field) => object | undefined;
export type RefetchQueriesFunction = (variables) => any;
export type ShouldFakeExecuteFunction = ((variables: object) => boolean | object) | boolean;
export type FetchPolicyFunction = (params: any) => any;

export enum refType {
  HasMany = 'HasMany',
  HasOne = 'HasOne',
  BelongsTo = 'BelongsTo',
  BelongsToMany = 'BelongsToMany',
}

export enum fieldType {
  number = 'number',
  string = 'string',
  date = 'date',
  boolean = 'boolean',
}

export interface IResourceReference {
  type: refType,
  resource: string;
}

export interface IField {
  ref?: IResourceReference,
  type?: fieldType;
}

export interface INamedField extends IField {
  name: string;
}

export type FieldsDefinition = {
  [name: string]: IField
}

export type FragmentsDefintions = {
  [name: string]: any;
}

/**
 * list of fields for specific Resource
 */
export interface IResourceFields {
  fields?: FieldsDefinition;
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
  getList?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getOne?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getMany?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  delete?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  create?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  update?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getManyReference?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getListResult?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getOneResult?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getManyResult?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  deleteResult?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  createResult?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  updateResult?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getManyReferenceResult?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getManyReferenceResultOpposite?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
  getManyReferenceResultRegular?: (fragments: FragmentsDefintions, queries: IResourceQueryDefinitions) => any,
}

export interface IResourceDefinition {
  name: string;
  fields?: FieldsDefinition;
  operations?: IResourceOperationsDefinition;
  queries?: IResourceQueryDefinitions;
  fragments?: FragmentsDefintions;
}

export interface IResourceOperationDefinition {
  parseResponse?: ResponseFunction;
  update?: UpdateFunction;
  variables?: VariablesFunction;
  fetchPolicy?: string | FetchPolicyFunction;
  orderBy?: OrderByFunction;
  filterBy?: FilterByFunction;
  refetchQueries?: RefetchQueriesFunction;
  shouldFakeExecute?: ShouldFakeExecuteFunction;
}

export interface IResource extends IResourceDefinition {
  name: string;
  fields: FieldsDefinition;
  operations: IResourceOperationsDefinition;
  queries: IResourceQueryDefinitions;
  fragments: FragmentsDefintions;
  resourceContainer: IResourceContainer;
  override: (overrides: IResourceDefinition) => IResource
  connect: (resourceContainer: IResourceContainer) => IResource
}

export interface IResourceContainer {
  register: (resource: IResourceDefinition) => void
  override: (resource: IResourceDefinition) => void
  queries: (resource: string, query: queries) => any
  resource(resource: string);
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
  refetchQueries: RefetchQueriesFunction;
  override: (overrides: IResourceOperationDefinition) => IResourceOperation
  connect: (resource: IResource) => IResourceOperation
}
