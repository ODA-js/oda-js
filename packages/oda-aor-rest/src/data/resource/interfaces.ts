import { queries } from "./consts";

export type ResponseFunction = (response: { data: any }, params: any) => { data: any };
export type UpdateFunction = (store, response) => void;
export type VariablesFunction = (params: any) => any;

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
  /**
   * list of fields
   */
  fields?: FieldsDefinition;
}

export interface IResourceOverride {
  fields: IResourceFields;
  GET_LIST?: IResourceOperation;
  GET_ONE?: IResourceOperation;
  CREATE?: IResourceOperation;
  UPDATE?: IResourceOperation;
  DELETE?: IResourceOperation;
  GET_MANY?: IResourceOperation;
  GET_MANY_REFERENCE?: IResourceOperation;
}

export interface IResourceOperationOverride {
  name: string,
  type: string,
  resourceContainer: IResourceContainer,
  query?: any,
  parseResponse?: (response: { data: any }) => { data: any },
  update?: (store, response) => void,
  variables?: (params: any) => { input: any },
  fetchPolicy?: string,
  orderBy: (field) => string | undefined,
  filterBy: (filter: object) => object,
  refetchQueries: (variables) => any,
}

export interface IResourceBase {
  name: string;
  query: any;
  override: (overrides: IResourceOverride) => void
}

export interface IResourceContainer {
  register: (name: string, resource: IResourceBase) => void
  override: (name: string, resource: IResourceOverride) => void
  queries: (resource: string, query: queries) => any
}

export interface IResourceOperation {

}