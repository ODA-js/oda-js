<#@ context 'entity'#>
<#@ alias 'type-resolver-imports'#>

import * as _ from 'lodash';
import { get } from 'lodash';

<#- if(entity.relations.length > 0){#>
import { RegisterConnectors } from '../../../common';
<# if(entity.relations.some(c=>c.verb === 'BelongsToMany' || c.verb === 'HasMany')) {-#>
import { emptyConnection, pagination, detectCursorDirection, consts, Filter } from 'oda-api-graphql';
<#}-#>
<#}-#>
import {
  Type,
  traverse,
  logger,
} from '../../../common';
import gql from 'graphql-tag';