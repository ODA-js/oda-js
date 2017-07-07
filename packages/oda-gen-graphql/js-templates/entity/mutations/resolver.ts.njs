<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:mutations:#{entity.name}');

import {
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';

import RegisterConnectors from '../../../../data/registerConnectors';
import { mutateAndGetPayload, idToCursor } from 'oda-api-graphql';
import { PubSubEngine } from 'graphql-subscriptions';

<#- for (let relEntity of entity.relEntities){#>
async function ensure#{relEntity.name}({
  args, context, create
}) {
  // find
  let filter;
  let fArgs;
  let variables;
  if (args.id) {
    fArgs = '$id: ID';
    filter = 'id: $id';
    variables = {
      id: args.id,
    };

  <#- for (let f of relEntity.unique.find) {#>
  } else if (args.#{f.name}) {
    fArgs = '$#{f.name}: #{f.type}';
    filter = '#{f.name}: $#{f.name}';
    variables = {
      #{f.name}: args.#{f.name},
    };
  <#-}#>
  <#- for (let f of relEntity.unique.complex) {
    let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
    let fArgs = f.fields.map(fld=>`${fld.name}: ${fld.type}`).join(', ');
    let filter = f.fields.map(fld=>`${fld.name}: $${fld.name}`).join(', ');
    #>
  } else if (#{condArgs}) {
    fArgs = '#{fArgs}';
    filter  ='#{filter}';
    variables = {
    <#- f.fields.forEach((fld, indx)=>{#>
      #{fld.name}: args.#{fld.name},
    <#-})#>
    };
  <#-}#>
  }
  let #{relEntity.findQuery};
  if (filter) {
    #{relEntity.findQuery} = await context.userGQL({
      query: `query find#{relEntity.name}(${fArgs}){
            #{relEntity.findQuery}(${filter}){
              id
            }
          }
          `,
      variables,
    }).then(r => r.data.#{relEntity.findQuery});
  }

  if (!#{relEntity.findQuery}) {
    if (create) {
      #{relEntity.findQuery} = await context.userGQL({
        query: `mutation create#{relEntity.name}($#{relEntity.findQuery}: create#{relEntity.name}Input!) {
            create#{relEntity.name}(input: $#{relEntity.findQuery}) {
              #{relEntity.findQuery} {
                node {
                  id
                }
              }
            }
          }
          `,
        variables: {
          #{relEntity.findQuery}: args,
        }
      }).then(r => r.data.create#{relEntity.name}.#{relEntity.findQuery}.node);
    }
  } else {
    // update
    #{relEntity.findQuery} = await context.userGQL({
      query: `mutation update#{relEntity.name}($#{relEntity.findQuery}: update#{relEntity.name}Input!) {
            update#{relEntity.name}(input: $#{relEntity.findQuery}) {
              #{relEntity.findQuery} {
                id
              }
            }
          }
          `,
      variables: {
        #{relEntity.findQuery}: args,
      }
    }).then(r => r.data.update#{relEntity.name}.#{relEntity.findQuery});
  }
  return #{relEntity.findQuery};
}
<#-}#>

<#- for (let r of entity.relations) {#>

async function linkTo#{r.cField}({
  context, #{r.field},  #{entity.ownerFieldName},
}) {
  if (#{r.field}) {
    await context.userGQL({
      query: `mutation addTo#{r.name}($input:addTo#{r.name}Input!) {
          addTo#{r.name}(input:$input){
            #{entity.ownerFieldName} {
              id
            }
          }
        }`,
      variables: {
        input: {
          #{entity.ownerFieldName}: toGlobalId('#{entity.name}', #{entity.ownerFieldName}.id),
          #{r.ref.fieldName}: #{r.field}.id,
        }
      }
    });
  }
}

async function unlinkFrom#{r.cField}({
  context, #{r.field},  #{entity.ownerFieldName},
}) {
  if (#{r.field}) {
    await context.userGQL({
      query: `mutation removeFrom#{r.name}($input: removeFrom#{r.name}Input!) {
          removeFrom#{r.name}(input:$input){
            #{entity.ownerFieldName} {
              id
            }
          }
        }`,
      variables: {
        input: {
          #{entity.ownerFieldName}: toGlobalId('#{entity.name}', #{entity.ownerFieldName}.id),
          #{r.ref.fieldName}: #{r.field}.id,
        }
      }
    });
  }
}

<#-}#>

export const mutation = {
  create#{entity.name}: mutateAndGetPayload( async (args: {
    <#- for (let f of entity.args.create.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let r of entity.relations) {#>
      #{r.field}?: object/*#{r.ref.entity}*/<#if(!r.single){#>[]<#}#>,
    <#-}#>
    },
    context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
    info,
  ) => {
    logger.trace('create#{entity.name}');
    let create: any = {
    <#- for (let f of entity.args.create.find) {#>
      #{f.name}: args.#{f.name},
    <#-}#>
    };

    if(args.id) {
      create.id = fromGlobalId(args.id).id;
    }

    let result = await context.connectors.#{entity.name}.create(create);

    if (context.pubsub) {
      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'CREATE',
          node: result,
          payload: result,
        }
      });
    }

    let #{entity.ownerFieldName}Edge = {
      cursor: idToCursor(result._id),
      node: result,
    };

    <#- for (let r of entity.relations) {#>

    if (args.#{r.field}<#if(!r.single){#> && Array.isArray(args.#{r.field}) && args.#{r.field}.length > 0<#}#> ) {
    <#if(!r.single){#>
      for (let i = 0, len = args.#{r.field}.length; i < len; i++) {
    <#}#>
      let #{r.field} = await ensure#{r.ref.entity}({
        args: args.#{r.field}<#if(!r.single){#>[i]<#}#>,
        context,
        create: true,
      });

      await linkTo#{r.cField}({
        context,
        #{r.field},
        #{entity.ownerFieldName}: result,
      });
    <#if(!r.single){#>
      }
    <#}#>
    }

    <#-}#>
    return {
      #{entity.ownerFieldName}: #{entity.ownerFieldName}Edge,
    };
  }),

  update#{entity.name}:  mutateAndGetPayload( async (args:  {
    <#- for (let f of entity.args.update.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let r of entity.relations) {#>
      #{r.field}?: object/*#{r.ref.entity}*/<#if(!r.single){#>[]<#}#>,
      #{r.field}Unlink?: object/*#{r.ref.entity}*/<#if(!r.single){#>[]<#}#>,
    <#-}#>
    },
    context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
    info,
  ) => {
    logger.trace('update#{entity.name}');
    let payload = {
    <#- for (let f of entity.args.update.payload) {#>
      #{f.name}: args.#{f.name},
    <#-}#>
    };

    let result;
    if (args.id) {
      result = await context.connectors.#{entity.name}.findOneByIdAndUpdate(fromGlobalId(args.id).id, payload);
    <#- for (let f of entity.args.update.find) {#>
    } else if (args.#{f.name}) {
      delete payload.#{f.name};
      result = await context.connectors.#{entity.name}.findOneBy#{f.cName}AndUpdate(args.#{f.name}, payload);
    <#-}#>
    <#- for (let f of entity.complexUnique) {
      let findBy = f.fields.map(f=>f.uName).join('And');
      let loadArgs = `${f.fields.map(f=>`args.${f.name}`).join(', ')}`;
      let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
    #>
    } else if (#{condArgs}) {
      <#-for(let fn of f.fields){#>
      delete payload.#{fn.name};
      <#-}#>
      result = await context.connectors.#{entity.name}.findOneBy#{findBy}AndUpdate(#{loadArgs}, payload);
    <#-}#>
    }

    if (context.pubsub) {
      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'UPDATE',
          node: result,
          payload,
        }
      });
    }

    <#- for (let r of entity.relations) {#>
    if (args.#{r.field}Unlink<#if(!r.single){#> && Array.isArray(args.#{r.field}Unlink) && args.#{r.field}Unlink.length > 0<#}#> ) {
    <#if(!r.single){#>
      for (let i = 0, len = args.#{r.field}Unlink.length; i < len; i++) {
    <#}#>
      let #{r.field} = await ensure#{r.ref.entity}({
        args: args.#{r.field}Unlink<#if(!r.single){#>[i]<#}#>,
        context,
        create: false,
      });

      await unlinkFrom#{r.cField}({
        context,
        #{r.field},
        #{entity.ownerFieldName}: result,
      });
    <#if(!r.single){#>
      }
    <#}#>
    }

    if (args.#{r.field}<#if(!r.single){#> && Array.isArray(args.#{r.field}) && args.#{r.field}.length > 0<#}#> ) {
    <#if(!r.single){#>
      for (let i = 0, len = args.#{r.field}.length; i < len; i++) {
    <#}#>
      let #{r.field} = await ensure#{r.ref.entity}({
        args: args.#{r.field}<#if(!r.single){#>[i]<#}#>,
        context,
        create: false,
      });

      await linkTo#{r.cField}({
        context,
        #{r.field},
        #{entity.ownerFieldName}: result,
      });
    <#if(!r.single){#>
      }
    <#}#>
    }

    <#-}#>
    return {
      #{entity.ownerFieldName}: result,
    };
  }),

  delete#{entity.name}:  mutateAndGetPayload(async (args: {
    <#- for (let f of entity.args.remove.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let f of entity.complexUnique) {
      let args = `${f.fields.map(f=>`${f.name}?: ${f.type}`).join(', ')}`;
      #>
      // #{f.name}
      #{args},
    <#-}#>
    },
    context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
    info,
  ) => {
    logger.trace('delete#{entity.name}');
    let result;
    if (args.id) {
      result = await context.connectors.#{entity.name}.findOneByIdAndRemove(fromGlobalId(args.id).id);
    <#- for (let f of entity.args.remove.find) {#>
    } else if (args.#{f.name}) {
      result = await context.connectors.#{entity.name}.findOneBy#{f.cName}AndRemove(args.#{f.name});
    <#-}#>
    <#- for (let f of entity.complexUnique) {
      let findBy = f.fields.map(f=>f.uName).join('And');
      let loadArgs = `${f.fields.map(f=>`args.${f.name}`).join(', ')}`;
      let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
      #>
    } else if (#{condArgs}) {
      result = await context.connectors.#{entity.name}.findOneBy#{findBy}AndRemove(#{loadArgs});
    <#-}#>
    }

    if (context.pubsub) {
      context.pubsub.publish('#{entity.name}', {
        #{entity.name}: {
          mutation: 'DELETE',
          node: result,
          payload: result,
        }
      });
    }

    return {
      deletedItemId: toGlobalId('#{entity.name}', result.id),
      #{entity.ownerFieldName}: result,
    };
  }),
}
;
