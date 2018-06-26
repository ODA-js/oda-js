<#@ context "entity" -#>
<#@ chunks "$$$main$$$" -#>

<#- chunkStart(`../../../${entity.name}/uix/index`); -#>
#{partial(entity, 'forms-index')}
<#- chunkStart(`../../../${entity.name}/uix/title`); -#>
#{partial(entity, 'forms-title')}
<#- chunkStart(`../../../${entity.name}/uix/list`); -#>
#{partial(entity, 'forms-list')}
<#- chunkStart(`../../../${entity.name}/uix/grid`); -#>
#{partial(entity, 'forms-grid')}
<#- chunkStart(`../../../${entity.name}/uix/gridView`); -#>
#{partial(entity, 'forms-grid-view')}
<#- chunkStart(`../../../${entity.name}/uix/filter`); -#>
#{partial(entity, 'forms-filter')}
<#- chunkStart(`../../../${entity.name}/uix/form`); -#>
#{partial(entity, 'forms-form-tabbed')}
<#- chunkStart(`../../../${entity.name}/uix/formSimple`); -#>
#{partial(entity, 'forms-form-simple')}
<#- chunkStart(`../../../${entity.name}/uix/edit`); -#>
#{partial(entity, 'forms-edit')}
<#- chunkStart(`../../../${entity.name}/uix/create`); -#>
#{partial(entity, 'forms-create')}
<#- chunkStart(`../../../${entity.name}/uix/cardView`); -#>
#{partial(entity, 'grid-card')}
<#- chunkStart(`../../../${entity.name}/uix/show`); -#>
#{partial(entity, 'forms-show-tabbed')}
<#- chunkStart(`../../../${entity.name}/uix/showSimple`); -#>
#{partial(entity, 'forms-show-simple')}
<#- chunkStart(`../../../i18n/${entity.name}`); -#>
#{partial(entity, 'forms-i18n')}
