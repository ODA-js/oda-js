<#@ chunks "$$$main$$$" -#>
<#@ context 'entity' #>

<#- chunkStart(`../../../gql/${entity.name}/index.ts`); -#>
#{partial(entity, 'entity-index')}

<#- chunkStart(`../../../gql/${entity.name}/type/index.ts`); -#>
#{partial(entity.type.resolver, 'type-resolver-imports')}
export default new Type({
  schema: gql`
    #{partial(entity.type.entry, 'type-entry')}
  `,
  resolver: {
    id: globalIdField('#{entity.name}', ({ _id }) => _id),
    #{partial(entity.type.resolver, 'type-resolver')}
  }
});
<#- chunkEnd() -#>
#{partial(entity.connections, 'connection-index')}

#{partial(entity.mutations, 'mutation-index')}

#{partial(entity.ensure, 'entity-helpers-ensure-entity')}
#{partial(entity.mutations.resolver, 'entity-helpers-unlink-from-all')}

