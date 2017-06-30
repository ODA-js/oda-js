<#@ context 'entity' -#>

<# block "create" : #>
# Create #{entity.name}
mutation create#{entity.name}($#{entity.ownerFieldName}: create#{entity.name}Input!){
  create#{entity.name}(input:$#{entity.ownerFieldName}){
    #{entity.ownerFieldName} {
      node {
        id
      }
    }
  }
}
<# end #>

<# block "update" : #>
# Update #{entity.name}
mutation update#{entity.name}($#{entity.ownerFieldName}: update#{entity.name}Input!){
  update#{entity.name}(input:$#{entity.ownerFieldName}){
    #{entity.ownerFieldName} {
      id
    }
  }
}
<# end #>

<# block "list" : #>
# List of #{entity.plural}
query #{entity.plural} {
  viewer{
    #{entity.dcPlural} {
      edges{
        node{
          ...View#{entity.name}Full
        }
      }
    }
  }
}
<# end #>

<# block "fragments" : #>
# fragments for single unique keys
<#- for (let f of entity.unique) {#>
fragment Embed#{entity.name}With#{f.cName} on #{entity.name} {
  #{f.name}
}
<#-}#>

<#-if(entity.complexUnique && entity.complexUnique.length > 0){#>
# fragments for complex unique keys
<#- for (let f of entity.complexUnique) {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let loadArgs = `${f.fields.map(f=>`args.${f.name}`).join(', ')}`;
  let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
#>
fragment Embed#{entity.name}With#{findBy} on #{entity.name} {
  <#- for(let fld of f.fields){ #>
  #{fld.name}
  <#-}#>
}
<#-}#>
<#-}#>

# fragments on entity
fragment View#{entity.name} on #{entity.name} {
  <#- for(let fld of entity.fields){ #>
  #{fld.name}
  <#-}#>
}

fragment View#{entity.name}Full on #{entity.name} {
  <#- for(let fld of entity.fields){ #>
  #{fld.name}
  <#-}#>
  <#- for(let fld of entity.relations){ #>
  #{fld.field} {
    <#-if(fld.single){#>
    ...Embed#{fld.ref.entity}WithId
    <#-} else {#>
    edges {
      node {
        ...Embed#{fld.ref.entity}WithId
      }
    }
    <#-}#>
  }
  <#-}#>
}

<# end #>

<# block "findBy" : #>
# fragments for single unique keys
<#- for (let f of entity.unique) {#>
query find#{entity.name}By#{f.cName}( $#{f.name}: #{f.type}) {
  #{entity.ownerFieldName}(#{f.name}:$#{f.name}:) {
    ...View#{entity.name}Full
  }
}
<#-}#>

<#-if(entity.complexUnique && entity.complexUnique.length > 0){#>
# fragments for complex unique keys
<#- for (let f of entity.complexUnique) {
  let findBy = f.fields.map(f=>f.uName).join('And');
  let loadArgs = `${f.fields.map(f=>`$${f.name}: ${f.type}`).join(', ')}`;
  let condArgs = `${f.fields.map(f=>`${f.name}: ${f.name}`).join(', ')}`;
#>
query find#{entity.name}By#{findBy}(#{loadArgs}) {
  #{entity.dcPlural}(#{condArgs}){
    ...View#{entity.name}Full
  }
}
<#-}#>
<#-}#>
<# end #>

