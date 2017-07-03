<#@ context 'entity' -#>
<#@ chunks '$$$main$$$' -#>

<# chunkStart(`../../../dataPump/${entity.name}/index`); #>
import imp from './import'
import exp from './export'

export const res = {
  ...imp,
  ...exp
}


<# chunkStart(`../../../dataPump/${entity.name}/import`); #>
export default {
  import: {
    queries : {
      #{entity.name}: {
        filter:`
          <#- for(let fld of entity.fields){ #>
            #{fld.name}
          <#-}#>
          <#- for(let fld of entity.relations){ #>
            #{fld.field}
          <#-}#>`,
        uploader: {
    <#- for (let f of entity.unique) {#>
          // findQuery: '#{entity.name}/findBy#{f.cName}.graphql',
    <#-}#>
    <#-if(entity.complexUnique && entity.complexUnique.length > 0){#>
    <#- for (let f of entity.complexUnique) {
      let findBy = f.fields.map(f=>f.uName).join('And');
    #>
          // findQuery: '#{entity.name}/findBy#{findBy}.graphql',
    <#-}#>
    <#-}#>
          // createQuery: '#{entity.name}/create.graphql',
          // updateQuery: '#{entity.name}/update.graphql',
          // dataPropName: '#{entity.ownerFieldName}',
    <#- for (let f of entity.unique) {#>
          // findVars: (f) => ({ #{f.name}: f.#{f.name} }),
    <#-}#>
    <#-if(entity.complexUnique && entity.complexUnique.length > 0){#>
    <#- for (let f of entity.complexUnique) {
        let condArgs = `{ ${f.fields.map(f=>`${f.name}: f.${f.name}`).join(', ')} }`;

    #>
          // findVars: (f) => (#{condArgs}),
    <#-}#>
    <#-}#>
        }
      }
    },
  },
}
<# chunkStart(`../../../dataPump/${entity.name}/export`); #>
export default {
  export: {
    queries: {
      #{entity.name}: {
        query: '#{entity.name}/list.graphql',
        process: (f) => ({
          #{entity.name}: f.viewer.#{entity.dcPlural} ? f.viewer.#{entity.dcPlural}.edges.map(e => ({
            ...e.node,
          <#- for(let fld of entity.relations){ #>
          <#-if(!fld.single){#>
            #{fld.field} : e.node.#{fld.field} ? e.node.#{fld.field}.edges.map(s => ({
              ...s.node,
            })) : [],
          <#-}#>
          <#-}#>
          })) : [],
        }),
      }
    }
  }
}
