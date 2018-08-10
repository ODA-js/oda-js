<#@ context 'entity'#>
<#@ alias 'type-resolver-imports'#>

import * as _ from 'lodash';
import * as get from 'lodash/get';

<#- if(entity.relations.length > 0){#>
import { RegisterConnectors } from '../../common';
<# if(entity.relations.some(c=>c.verb === 'BelongsToMany' || c.verb === 'HasMany')) {-#>
import { idToCursor, emptyConnection, pagination, detectCursorDirection, consts, Filter } from 'oda-api-graphql';
<#}-#>
<#}-#>
import {
  Type,
  traverse,
  logger,
} from '../../common';
import gql from 'graphql-tag';