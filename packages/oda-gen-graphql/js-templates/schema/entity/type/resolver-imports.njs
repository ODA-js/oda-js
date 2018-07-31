<#@ context 'entity'#>
<#@ alias 'type-resolver-imports'#>

import * as _ from 'lodash';
import * as get from 'lodash/get';

<#- debugger;
if(entity.relations.length > 0){#>
import { RegisterConnectors } from '../../common';
<# if(entity.relations.some(c=>c.verb === 'BelongsToMany' || c.verb === 'HasMany')) {-#>
import { idToCursor, emptyConnection, pagination, detectCursorDirection, consts, Filter } from 'oda-api-graphql';
<#}-#>
<#}-#>
import {
  Type,
  globalIdField,
  traverse,
  logger,
} from '../../common';
import gql from 'graphql-tag';