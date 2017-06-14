<#@ context 'entity' -#>
<#@ requireAs ('entity/type/enums.graphql.njs', 'enums') #>
<#@ requireAs ('entity/type/entry.graphql.njs', 'type') #>
<#@ requireAs ('entity/connections/types.graphql.njs', 'connections.types') #>
<#@ requireAs ('entity/connections/mutations/types.graphql.njs', 'connections.mutation') #>
<#@ requireAs ('entity/connections/mutations/entry.graphql.njs', 'connections.mutation.entry') #>
<#@ requireAs ('entity/connections/subscriptions/types.graphql.njs', 'connections.subscription') #>
<#@ requireAs ('entity/connections/subscriptions/entry.graphql.njs', 'connections.subscription.entry') #>
<#@ requireAs ('entity/mutations/types.graphql.njs', 'mutation.types') #>
<#@ requireAs ('entity/mutations/entry.graphql.njs', 'mutation.entry') #>
<#@ requireAs ('entity/subscriptions/types.graphql.njs', 'subscription.types') #>
<#@ requireAs ('entity/subscriptions/entry.graphql.njs', 'subscription.entry') #>
<#@ requireAs ('entity/query/entry.graphql.njs', 'query.entry') #>
<#@ requireAs ('entity/viewer/entry.graphql.njs', 'viewer.entry') #>

import { common } from 'oda-gen-graphql';

let { fillDefaults, deepMerge } = common.lib;

import { query } from './query/resolver';
import { viewer } from './viewer/resolver';
import { resolver } from './type/resolver';
import { mutation as connectionMutation } from './connections/mutations/resolver';
import { mutation as connectionMutation } from './connections/subscriptions/resolver';
import { mutation as entityMutation } from './mutations/resolver';
import { mutation as entityMutation } from './subscriptions/resolver';

export class #{entity.name}Entity extends common.types.GQLModule {
  constructor(_args) {
    super(_args);
    this._query = fillDefaults(this._query, query);
    this._viewer = fillDefaults(this._viewer, viewer);
    this._resolver = fillDefaults(this._resolver, resolver);

    this._typeDef = fillDefaults(this._typeDef, {
      'enums': [`#{partial(entity.partials['enums'], 'enums')}`],
      'type': [`#{partial(entity.partials['type'], 'type')}`],
      'mutationTypes': [`#{partial(entity.partials['mutation.types'], 'mutation.types')}`],
      'subscriptionsTypes': [`#{partial(entity.partials['subscription.types'], 'subscription.types')}`],
      'connectionsTypes': [`#{partial(entity.partials['connections.types'], 'connections.types')}`],
      'connectionsMutation': [`#{partial(entity.partials['connections.mutation'], 'connections.mutation')}`],
      'subscriptionsMutation': [`#{partial(entity.partials['connections.subscription'], 'connections.subscription')}`],
    });

    this._mutationEntry = fillDefaults(this._mutationEntry, {
      'mutationEntry': [`#{partial(entity.partials['mutation.entry'], 'mutation.entry')}`],
      'connectionsMutationEntry': [`#{partial(entity.partials['connections.mutation.entry'],'connections.mutation.entry')}`],
    });

    this._subscriptionEntry = fillDefaults(this._mutationEntry, {
      'subscriptionEntry': [`#{partial(entity.partials['subscription.entry'], 'subscription.entry')}`],
      'connectionsSubscriptionEntry': [`#{partial(entity.partials['connections.subscription.entry'],'connections.subscription.entry')}`],
    });

    this._queryEntry = fillDefaults(this._queryEntry, {
      'queryEntry': [`#{partial(entity.partials['query.entry'], 'query.entry')}`],
    });

    this._mutation = fillDefaults(this._mutation, deepMerge(entityMutation, connectionMutation));

    this._viewerEntry = fillDefaults(this._viewerEntry, {
      'viewerEntry': [`#{partial(entity.partials['viewer.entry'], 'viewer.entry')}`],
    });
  }
}
