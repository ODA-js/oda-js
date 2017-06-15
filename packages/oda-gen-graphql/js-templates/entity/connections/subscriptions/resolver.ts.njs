<#@ context 'entity' -#>

export const unionResover = {
  // #{entity.name}ConnectionsSubscriptionPayload: {
  //   __resolveType(obj, context, info) {
  // <#-for ( let connection of entity.connections ) {#>
  //     if (obj.#{entity.ownerFieldName} && obj.#{connection.refFieldName}) {
  //       return "#{connection.name}SubscriptionPayload";
  //     }
  // <#-}#>
  //     return null;
  //   }
  // }
};
