import { Entity, ModelPackage } from 'oda-model';
import { mapToGraphqlTypes, printRequired, printArguments } from './../../utils';

import { Factory } from 'fte.js';

export const template = 'entity/type/entry.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl) {
  return te.run(mapper(entity, pack, role, allowAcl), template);
}

export interface MapperOutput {
  name: string;
  description: string;
  filter: string[];
  fields: {
    name: string;
    description: string;
    type: string;
    args: string;
  }[];
  relations: {
    entity: string,
    name: string;
    description: string;
    type: string;
    connectionName: string;
    single: boolean;
    args: string;
  }[];
}

import {
  getFieldsForAcl,
  filterForAcl,
  fields,
  relationFieldsExistsIn,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl): MapperOutput {
  let fieldsAcl = getFieldsForAcl(allowAcl)(role)(entity);
  let filter = filterForAcl(allowAcl)(role)(entity)
    .map(k => {
      let field = entity.fields.get(k);
      let type;
      if (field.relation) {
        type = pack.entities.get(field.relation.ref.entity).fields.get(field.relation.ref.field).type;
      } else {
        type = field.type;
      }
      return {
        name: k,
        type: `Where${mapToGraphqlTypes(type)}`,
      }
    })
    .map(i => `${i.name}: ${i.type}`);

  return {
    name: entity.name,
    description: entity.description ? entity.description.split('\n').map(d => {
      return (d.trim().match(/#/)) ? d : `# ${d}`;
    }).join('\n') : entity.description,
    filter,
    fields: fieldsAcl
      .filter(fields)
      .map(f => {
        let args = printArguments(f);
        return {
          name: f.name,
          description: f.description ? f.description.split('\n').map(d => {
            return (d.trim().match(/#/)) ? d : `# ${d}`;
          }).join('\n') : f.description,
          type: `${mapToGraphqlTypes(f.type)}${printRequired(f)}`,
          args: args ? `(${args})` : '',
        };
      }),
    relations: fieldsAcl
      .filter(relationFieldsExistsIn(pack))
      .map(f => {
        let single = f.relation.single;
        let args = printArguments(f);
        if (args) {
          if (single) {
            args = `(${args})`;
          } else {
            args = `, ${args}`;
          }
        }

        let refe = pack.entities.get(f.relation.ref.entity);

        return {
          entity: f.relation.ref.entity,
          name: f.name,
          description: f.description ? f.description.split('\n').map(d => {
            return (d.trim().match(/#/)) ? d : `# ${d}`;
          }).join('\n') : f.description,
          single,
          args,
          type: `${mapToGraphqlTypes(f.relation.ref.entity)}${printRequired(f)}`,
          connectionName: `${f.derived ? refe.plural : f.relation.fullName}Connection${printRequired(f)}`,
        };
      }),
  };
}
