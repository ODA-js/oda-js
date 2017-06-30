<#@ context 'entity' -#>

export default {
  uri: 'http://localhost:3003/graphql',
  import:{
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
          // findQuery: '#{entity.name}/findById.graphql',
          // createQuery: '#{entity.name}/create.graphql',
          // updateQuery: '#{entity.name}/update.graphql',
          // dataPropName: '#{entity.ownerFieldName}',
          // findVars: (f) => ({ id: f.id }),
        }
      }
    },
  },
  export: {
    queries:{
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
