import { queries } from './consts';

export type ResponseFunction = (response: { data: any }, params: any) => { data: any };
export type UpdateFunction = (store, response) => void;
export type VariablesFunction = (params: any) => any;
export type OrderByFunction = (field) => string | undefined;
export type FilterByFunction = (field) => object | undefined;
export type RefetchQueriesFunction = (variables) => any;

export enum refType {
  single = 'single',
  many = 'many',
}

export enum fieldType {
  number = 'number',
  string = 'string',
  date = 'date',
}

export interface Field {
  ref?: refType,
  refResource?: string;
  type?: fieldType;
}

export type FieldsDefinition = {
  [name: string]: Field
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

export interface IResourceOperationOverride {
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

export interface IResourceOperation extends IResourceOperationOverride {
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