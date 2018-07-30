<#@ chunks "$$$main$$$" -#>
<#@ alias 'query-single'#>
<#@ context 'ctx'#>

<#-chunkStart(`../../../gql/${ctx.entry.name}/query/item/${ctx.entry.singularEntry}.ts`); -#>
import {
  Query,
  logger,
  RegisterConnectors,
  getValue,
} from '../../../common';
import gql from 'graphql-tag';

export default new Query({
  schema: gql`
    extend type RootQuery {
      #{ctx.entry.singularEntry}(#{ctx.entry.unique}): #{ctx.entry.name}
    }
  `,
  resolver: async (
    owner,
    args: {
    <#- for (let f of ctx.resolver.unique.args) {#>
      #{f.name}?: #{f.type},
    <#-}#>
    <#- for (let f of ctx.resolver.unique.complex) {
        let args = `${f.fields.map(f=>`${f.name}?: ${f.type}`).join(', ')}`;
      #>
      // #{f.name}
      #{args},
    <#-}#>
    },
    context: { connectors: RegisterConnectors },
    info
  ) => {
    logger.trace('#{ctx.resolver.singular}');
    let result;
    if (args.id) {
      result = await context.connectors.#{ctx.resolver.name}.findOneById(getValue(args.id));
    <#- for (let f of ctx.resolver.unique.find) {#>
    } else if (args.#{f.name}) {
      result = await context.connectors.#{ctx.resolver.name}.findOneBy#{f.cName}(args.#{f.name});
    <#-}#>
    <#- for (let f of ctx.resolver.unique.complex) {
      let findBy = f.fields.map(f=>f.uName).join('And');
      let loadArgs = `${f.fields.map(f=>f.gqlType === 'ID' ? `getValue(args.${f.name})` : `args.${f.name}`).join(', ')}`;
      let condArgs = `${f.fields.map(f=>`args.${f.name}`).join(' && ')}`;
#>
    } else if (#{condArgs}) {
      result = await context.connectors.#{ctx.resolver.name}.findOneBy#{findBy}(#{loadArgs});
    <#-}#>
    }
    return result;
  },
});
