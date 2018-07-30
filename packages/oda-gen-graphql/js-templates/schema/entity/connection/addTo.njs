<#@ chunks "$$$main$$$" -#>
<#@ alias 'connection-mutations-addTo'#>
<#@ context 'ctx'#>

<#- 
const {entity, connection} = ctx;
chunkStart(`../../../gql/${entity.name}/connections/addTo${connection.relationName}.ts`); -#>
<# slot('import-connection-index-slot',`addTo${connection.relationName}`) #>
<# slot('export-connection-index-slot',`addTo${connection.relationName}`) #>
import {
  ModelType,
  logger,
  RegisterConnectors,
  mutateAndGetPayload,
  PubSubEngine,
  Mutation,
  fromGlobalId,
} from '../../common';
import gql from 'graphql-tag';

export default new Mutation({
  type: ModelType.mutation,
  schema: gql`
    extend type RootMutation {
      addTo#{connection.relationName}(
        input: addTo#{connection.relationName}Input
      ): addTo#{connection.relationName}Payload
    }
  `,
  resolver: mutateAndGetPayload(
    async (
      args: {
    <#- for (let f of connection.addArgs) {#>
        #{f.name}?: #{f.type},
    <#-}#>
      },
      context: { connectors: RegisterConnectors, pubsub: PubSubEngine },
      info
    ) => {
      logger.trace('addTo#{connection.relationName}');
      let { id: #{entity.ownerFieldName} } = fromGlobalId(args.#{entity.ownerFieldName});
      let { id: #{connection.refFieldName} } = fromGlobalId(args.#{connection.refFieldName});
      let payload = {
        #{entity.ownerFieldName},
        #{connection.refFieldName},
<#-
for (let fname of connection.ref.fields){
  if (fname !== 'id') { #>
        #{fname}: args.#{fname},
<#-
  }
}#>
      };

      await context.connectors.#{entity.name}.addTo#{connection.shortName}(payload);

      let source = await context.connectors.#{entity.name}.findOneById(#{entity.ownerFieldName});

      if (context.pubsub) {
        context.pubsub.publish('#{entity.name}', {
          #{entity.name}: {
            mutation: 'LINK',
            node: source,
            previous: null,
            updatedFields: [],
            payload: {
              args: {
                #{entity.ownerFieldName}: args.#{entity.ownerFieldName},
                #{connection.refFieldName}: args.#{connection.refFieldName},
<#- for (let fname of connection.ref.fields){
  if (fname !== 'id') { #>
                #{fname}: args.#{fname},
<#-
  }
}#>
              },
              relation: '#{connection.name}'
            }
          }
        });
      <#if(connection.opposite){#>
        let dest = await context.connectors.#{connection.refEntity}.findOneById(#{connection.refFieldName});

        context.pubsub.publish('#{connection.refEntity}', {
          #{connection.refEntity}: {
            mutation: 'LINK',
            node: dest,
            previous: null,
            updatedFields: [],
            payload: {
              args: {
                #{entity.ownerFieldName}: args.#{entity.ownerFieldName},
                #{connection.refFieldName}: args.#{connection.refFieldName},
              },
              relation: '#{connection.opposite}'
            }
          }
        });
      <#}#>
      }
      return {
        #{entity.ownerFieldName}: source,
      };
    }),
});
