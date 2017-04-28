<#@ context 'entity' -#>
import {
  fromGlobalId,
} from 'graphql-relay';

import RegisterConnectors from '../../../../data/registerConnectors';
import { idToCursor, emptyConnection, pagination } from 'oda-api-graphql';
import { query } from '../query/resolver';

export const viewer: { [key: string]: any } = {
  Viewer: query
};
