<#@ context 'entity' -#>

 export interface #{entity.name} {
  <#- entity.fields.forEach(field => { #>
  #{field.name}<#- if(!field.required){#>?<#-}#>: #{field.type};
  <#- })#>
}

export interface #{entity.name}Edge {
  cursor: String;
  node: #{entity.name};
}

export interface #{entity.name}Connection {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
    count?: number;
  };
  edges: #{entity.name}Edge[];
}




