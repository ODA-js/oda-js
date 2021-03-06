import { Entity, HasMany, BelongsToMany, ModelPackage } from 'oda-model';
import { printRequired, printArguments } from '../../utils';
import { Factory } from 'fte.js';

export const template = 'entity/connections/types.graphql.njs';
import { persistentRelations, getFieldsForAcl } from '../../queries';

export function generate(
  te: Factory,
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
) {
  return te.run(mapper(entity, pack, role, aclAllow, typeMapper), template);
}

export interface MapperOutput {
  name: string;
  plural: string;
  connections: {
    connectionName: string;
    refType: string;
    fields: {
      name: string;
      description: string;
      type: string;
      argsString: string;
    }[];
  }[];
}

export function mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (string) => string },
): MapperOutput {
  return {
    name: entity.name,
    plural: entity.plural,
    connections: getFieldsForAcl(aclAllow, role, pack)(entity)
      .filter(persistentRelations(pack))
      .filter(
        f =>
          f.relation instanceof HasMany || f.relation instanceof BelongsToMany,
      )
      .map(f => {
        let relFields = [];
        if (f.relation.fields && f.relation.fields.size > 0) {
          f.relation.fields.forEach(field => {
            let argsString = printArguments(field, typeMapper.graphql);
            relFields.push({
              name: field.name,
              description: field.description
                ? field.description
                    .split('\n')
                    .map(d => {
                      return d.trim().match(/#/) ? d : `# ${d}`;
                    })
                    .join('\n')
                : field.description,
              type: `${typeMapper.graphql(field.type)}${printRequired(field)}`,
              argsString: argsString ? `(${argsString})` : '',
            });
          });
        }
        return {
          connectionName: f.relation.fullName,
          refType: f.relation.ref.entity,
          fields: relFields,
        };
      }),
  };
}
