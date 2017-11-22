import { queries } from './consts';

export type ResponseFunction = (response: { data: any }, params: any) => { data: any };
export type UpdateFunction = (store, response) => void;
export type VariablesFunction = (params: any) => any;
export type OrderByFunction = (field) => string | undefined;
export type FilterByFunction = (field) => object | undefined;
export type RefetchQueriesFunction = (variables) => any;

export enum refType {
  hasMany = 'hasMany',
  hasOne = 'hasOne',
  belongsTo = 'belongsTo',
  belongsToMany = 'belongsToMany',
}

export enum fieldType {
  number = 'number',
  string = 'string',
  date = 'date',
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

/**
 * list of fields for specific Resource
 */
export interface IResourceFields {
  fields?: FieldsDefinition;
}

export interface IResourceQueryDefinition {
  GET_LIST?: IResourceOperation;
  GET_ONE?: IResourceOperation;
  CREATE?: IResourceOperation;
  UPDATE?: IResourceOperation;
  DELETE?: IResourceOperation;
  GET_MANY?: IResourceOperation;
  GET_MANY_REFERENCE?: IResourceOperation;
}

export interface IResourceDefinition {
  name: string;
  fields?: FieldsDefinition;
  query?: IResourceQueryDefinition;
}

export interface IResourceOperationDefinition {
  query?: any;
  parseResponse?: ResponseFunction;
  update?: UpdateFunction;
  variables?: VariablesFunction;
  type?: queries;
  fetchPolicy?: string;
  orderBy?: OrderByFunction;
  filterBy?: FilterByFunction;
  refetchQueries?: RefetchQueriesFunction;
}

export interface IResource extends IResourceDefinition {
  name: string;
  fields: FieldsDefinition;
  query: IResourceQueryDefinition;
  override: (overrides: IResourceDefinition) => void
  resourceContainer: IResourceContainer;
}

export interface IResourceContainer {
  register: (resource: IResourceDefinition) => void
  override: (resource: IResourceDefinition) => void
  queries: (resource: string, query: queries) => any
}

export interface IResourceOperation extends IResourceOperationDefinition {
  resource: IResource;
  query: any;
  resultQuery: any;
  parseResponse: ResponseFunction;
  update: UpdateFunction;
  variables: VariablesFunction;
  type: queries;
  fetchPolicy: string;
  orderBy: OrderByFunction;
  filterBy: FilterByFunction;
  refetchQueries: RefetchQueriesFunction;
}
