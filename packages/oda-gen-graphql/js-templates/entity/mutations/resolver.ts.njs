<#@ context 'entity' -#>
import * as log4js from 'log4js';
let logger = log4js.getLogger('graphql:mutations:#{entity.name}');

import {
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';

import RegisterConnectors from '../../../../data/registerConnectors';
import { mutateAndGetPayload, idToCursor } from 'oda-api-graphql';

export const mutation = {
  create#{entity.name}: mutateAndGetPayload( async (args: {
    <#- for (let f of entity.args.create.args) {#>
      #{f.name}?: #{f.type},
      <#-}#>
    },
    context: { connectors: RegisterConnectors },
    info,
  ) => {
    logger.trace('create#{entity.name}');
    let create: any = {
    <#- for (let f of entity.args.create.find) {#>
      #{f.name}: args.#{f.name},
    <#-}#>
    };

    if(args.id){
      create.id = fromGlobalId(args.id).id;
    }

    let #{entity.ownerFieldName} = await context.connectors.#{entity.name}.create(create);

    let #{entity.ownerFieldName}Edge = {
      cursor: idToCursor(#{entity.ownerFieldName}._id),
      node: #{entity.ownerFieldName},
    };

    return {
      #{entity.ownerFieldName}: #{entity.ownerFieldName}Edge,
    };
  }),

  update#{entity.name}:  mutateAndGetPayload( async (args:  {
    <#- for (let f of entity.args.update.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    },
    context: { connectors: RegisterConnectors },
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
      result = await context.connectors.#{entity.name}.findOneBy#{f.cName}AndUpdate(args.#{f.name}, payload);
    <#-}#>
    <#- for (let f of entity.complexUnique) {
      let findBy = f.fields.map(f=>f.uName).join('And');
      let loadArgs = `${f.fields.map(f=>`args.${f.name}`).join(', ')}`;
      let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
    #>
    } else if (#{condArgs}) {
      result = await context.connectors.#{entity.name}.findOneBy#{findBy}AndUpdate(#{loadArgs}, payload);
    <#-}#>
    }

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
    context: { connectors: RegisterConnectors },
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

    return {
      deletedItemId: toGlobalId('#{entity.name}', result.id),
      #{entity.ownerFieldName}: result,
    };
  }),
}
;
