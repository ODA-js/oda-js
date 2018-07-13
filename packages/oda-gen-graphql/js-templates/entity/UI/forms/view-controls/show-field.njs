<#@ context "ctx" -#>
<#@ alias 'show-field' -#>
<#-
  const {entity, f} = ctx;
-#>
<#-
const type = (f.type=="Number" ? "Text" : f.type) + 'Field';
slot('import-from-react-admin-show',`${type}`);
-#>
<#{type} 
  label="resources.#{entity.name}.fields.#{f.name}" 
  source="#{f.name}"
/>