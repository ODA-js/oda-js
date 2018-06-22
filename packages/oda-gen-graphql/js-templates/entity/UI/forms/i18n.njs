<#@ context "entity" -#>
<#@ alias 'forms-i18n' -#>

export default {
  resources: {
    #{entity.name}: {
      summary: 'Summary',
      name: '#{entity.title} |||| #{ entity.titlePlural || entity.plural }',
      listName: '#{entity.name} |||| #{entity.plural}',
      fields: {

<#entity.props.forEach(f=>{
  if(!f.ref){
-#>
        #{f.name}: '#{f.label}',
<#} else if(f.ref) {-#>
        #{f.field}: '#{f.label}',
<#}
})-#>
      },
    },
  },
}