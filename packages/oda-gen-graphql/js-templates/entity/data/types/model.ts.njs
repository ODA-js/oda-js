<#@ context 'entity' -#>

 export interface I#{entity.name} {
  <#- entity.fields.forEach(field => { #>
  #{field.name}<#- if(!field.required){#>?<#-}#>: #{field.type};
  <#- })#>
}

export interface I#{entity.name}Edge {
  cursor: String;
  node: I#{entity.name};
}

export interface I#{entity.name}Connection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  edges: I#{entity.name}Edge[];
}




