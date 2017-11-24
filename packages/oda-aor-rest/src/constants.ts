
import {
  GET_LIST as AOR_GET_LIST,
  GET_ONE as AOR_GET_ONE,
  GET_MANY as AOR_GET_MANY,
  GET_MANY_REFERENCE as AOR_GET_MANY_REFERENCE,
  CREATE as AOR_CREATE,
  UPDATE as AOR_UPDATE,
  DELETE as AOR_DELETE,
} from 'admin-on-rest';

export const GET_LIST: string = AOR_GET_LIST;
export const GET_ONE: string = AOR_GET_ONE;
export const GET_MANY: string = AOR_GET_MANY;
export const GET_MANY_REFERENCE: string = AOR_GET_MANY_REFERENCE;
export const CREATE: string = AOR_CREATE;
export const UPDATE: string = AOR_UPDATE;
export const DELETE: string = AOR_DELETE;

export const QUERY_TYPES: string[] = [GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE];
export const MUTATION_TYPES: string[] = [CREATE, UPDATE, DELETE];
export const ALL_TYPES: string[] = QUERY_TYPES.concat(MUTATION_TYPES);
export enum SortOrder {
  ASC = 'Asc',
  DESC = 'Desc',
}
export enum SortReverseOrder {
  ASC = 'Desc',
  DESC = 'Asc',
}