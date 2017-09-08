import { Entity, ModelPackage } from 'oda-model';
import { printRequired, printArguments } from './../../utils';

import { Factory } from 'fte.js';

export const template = 'entity/type/entry.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, allowAcl, typeMapper: { [key: string]: (string) => string }) {
  return te.run(mapper(entity, pack, role, allowAcl, typeMapper), template);
}

export interface MapperOutput {
  name: string;
  description: string;
  filter: string[];
  filterSubscriptions: string[];
  filterEmbed: string[];
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
  //filterSubscriptionsForAcl,
  fields,
  relationFieldsExistsIn,
  idField,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, allowAcl, typeMapper: { [key: string]: (string) => string }): MapperOutput {
  let fieldsAcl = getFieldsForAcl(allowAcl)(role)(entity);
  let filter = filterForAcl(allowAcl)(role)(entity)
    .filter(k => {
      let f = entity.fields.get(k);
      if (!f.relation) {
        return true;
      }
      if (!f.relation.emdebbed) {
        return false;
      }
      let ref = pack.relations.get(entity.name).get(f.name);
      if (!ref) {
        return false;
      }
      let ent = pack.entities.get(ref.relation.ref.entity);
      return !!ent;
    })
    .map(k => {
      let field = entity.fields.get(k);
      let type;
      if (field.relation) {
        let ref = pack.relations.get(entity.name).get(field.name);
        let ent = pack.entities.get(ref.relation.ref.entity);
        type = ent.fields.get(ref.relation.ref.field).type;
      }
      else {
        type = field.type;
      }
      return {
        name: k,
        type: `Where${idField(field) ? 'ID' : typeMapper.graphql(type)}`,
      }
    })
    .map(i => `${i.name}: ${i.type}`);

  // не используем до лучших времен!!! поиск по вложенным объекта только.... для mongo и для sequelize
  let filterEmbed = filterForAcl(allowAcl)(role)(entity)
    .filter(k => {
      let f = entity.fields.get(k);
      if (!f.relation) {
        return true;
      }
      let ref = pack.relations.get(entity.name).get(f.name);
      if (!ref) {
        return false;
      }
      let ent = pack.entities.get(ref.relation.ref.entity);
      return !!ent;
    })
    .map(k => {
      let field = entity.fields.get(k);
      let type;
      if (field.relation) {
        let ref = pack.relations.get(entity.name).get(field.name);
        let ent = pack.entities.get(ref.relation.ref.entity);
        field.relation.single
        type = `${field.relation.single ? '' : 'Embed'}${ent.name}Filter`;
      }
      else {
        type = `Where${idField(field) ? 'ID' : typeMapper.graphql(field.type)}`;
      }
      return {
        name: k,
        type,
      }
    })
    .map(i => `${i.name}: ${i.type}`);


  let filterSubscriptions = filterForAcl(allowAcl)(role)(entity)
    .map(k => {
      // если что можно восстановить поиск по встроенным полям от реляций
      // нужно продумать.
      let field = entity.fields.get(k);
      let type = `Where${idField(field) ? 'ID' : typeMapper.graphql(field.type)}`;
      return {
        name: k,
        type,
      }
    })
    .map(i => `${i.name}: ${i.type}`);

  return {
    name: entity.name,
    description: entity.description ? entity.description.split('\n').map(d => {
      return (d.trim().match(/#/)) ? d : `# ${d}`;
    }).join('\n') : entity.description,
    filter,
    filterEmbed,
    filterSubscriptions,
    fields: fieldsAcl
      .filter(fields)
      .map(f => {
        let args = printArguments(f, typeMapper.graphql);
        return {
          name: f.name,
          description: f.description ? f.description.split('\n').map(d => {
            return (d.trim().match(/#/)) ? d : `# ${d}`;
          }).join('\n') : f.description,
          type: `${idField(f) ? 'ID' : typeMapper.graphql(f.type)}${printRequired(f)}`,
          args: args ? `(${args})` : '',
        };
      }),
    relations: fieldsAcl
      .filter(relationFieldsExistsIn(pack))
      .map(f => {
        let single = f.relation.single;
        let args = printArguments(f, typeMapper.graphql);
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
          type: `${typeMapper.graphql(f.relation.ref.entity)}${printRequired(f)}`,
          connectionName: `${f.derived ? refe.plural : f.relation.fullName}Connection${printRequired(f)}`,
        };
      }),
  };
}
