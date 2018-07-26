<#@ context 'entity'#>
<#@ alias 'type-resolver-imports'#>

import * as log4js from 'log4js';
import * as _ from 'lodash';
import * as get from 'lodash/get';

<#-if(entity.relations.length > 0){#>
import { RegisterConnectors } from '../../common';
<# if(entity.relations.some(c=>c.verb === 'BelongsToMany' || c.verb === 'HasMany')) {-#>
import { idToCursor, emptyConnection, pagination, detectCursorDirection, consts, Filter } from 'oda-api-graphql';
<#}-#>
<#}-#>
let logger = log4js.getLogger('graphql:query:#{entity.name}');
import {
  ModelType,
  Type,
  globalIdField,
  traverse,
} from '../../common';
import gql from 'graphql-tag';