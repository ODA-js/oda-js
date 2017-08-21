import { Entity, ModelPackage, BelongsToMany } from 'oda-model';
import { printRequired, decapitalize, capitalize } from './../../utils';

import { Factory } from 'fte.js';

export const template = 'entity/mutations/types.graphql.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage, role: string, aclAllow, typeMapper: { [key: string]: (string) => string }) {
  return te.run(mapper(entity, pack, role, aclAllow, typeMapper), template);
}

export interface MapperOutput {
  name: string;
  plural: string;
  payloadName: string;
  relations: {
    derived: boolean;
    persistent: boolean;
    field: string;
    single: boolean,
    ref: {
      entity: string;
    }
  }[];
  create: {
    name: string;
    type: string;
  }[];
  update: {
    name: string;
    type: string;
  }[];
  unique: {
    name: string;
    type: string;
  }[];
}

import {
  getFieldsForAcl,
  identityFields,
  mutableFields,
  relationFieldsExistsIn,
  getRelationNames,
  getFields,
  idField,
} from '../../queries';

export function mapper(entity: Entity, pack: ModelPackage, role: string, aclAllow, typeMapper: { [key: string]: (string) => string }): MapperOutput {
  let fieldsAcl = getFieldsForAcl(aclAllow)(role)(entity);
  let ids = getFields(entity).filter(idField);

  return {
    name: entity.name,
    plural: entity.plural,
    payloadName: decapitalize(entity.name),
    relations: fieldsAcl
      .filter(relationFieldsExistsIn(pack))
      .map(f => {
        let verb = f.relation.verb;
        return {
          persistent: f.persistent,
          derived: f.derived,
          field: f.name,
          single: (verb === 'BelongsTo' || verb === 'HasOne'),
          ref: {
            entity: f.relation.ref.entity,
          },
        };
      }),
    create: [
      ...ids.map(f => ({
        name: f.name,
        type: 'ID',
        required: false,
      })),
      ...fieldsAcl
        .filter(mutableFields)]
      .map(f => ({
        name: f.name,
        type: `${typeMapper.graphql(f.type)}${printRequired(f)}`,
      })),
    update: [
      ...ids.map(f => ({
        name: f.name,
        type: 'ID',
        required: false,
      })),
      ...fieldsAcl
        .filter(mutableFields)]
      .map(f => ({
        name: f.name,
        type: `${typeMapper.graphql(f.type)}`,
      })),
    unique: [
      ...[
        ...ids.map(f => ({
          name: f.name,
          type: 'ID',
        })),
        ...fieldsAcl
          .filter(identityFields)]
        .map(f => ({
          name: f.name,
          type: typeMapper.graphql(f.type),
        }))],
  };
}


