
import {
  GET_LIST as RA_GET_LIST,
  GET_ONE as RA_GET_ONE,
  GET_MANY as RA_GET_MANY,
  GET_MANY_REFERENCE as RA_GET_MANY_REFERENCE,
  CREATE as RA_CREATE,
  UPDATE as RA_UPDATE,
  DELETE as RA_DELETE,
} from 'ra-core';

export const actionType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  CLONE: 'CLONE',
  USE: 'USE',
  UNLINK: 'UNLINK',
}

export const GET_LIST: string = RA_GET_LIST;
export const GET_ONE: string = RA_GET_ONE;
export const GET_MANY: string = RA_GET_MANY;
export const GET_MANY_REFERENCE: string = RA_GET_MANY_REFERENCE;
export const CREATE: string = RA_CREATE;
export const UPDATE: string = RA_UPDATE;
export const DELETE: string = RA_DELETE;

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