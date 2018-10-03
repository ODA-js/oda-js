import { Entity, ModelPackage, FieldType } from 'oda-model';
import { Factory } from 'fte.js';
import { lib } from 'oda-gen-common';
let get = lib.get;

export const template = {
  mongoose: 'entity/data/mongoose/schema.ts.njs',
  sequelize: 'entity/data/sequelize/schema.ts.njs',
};

export function generate(
  te: Factory,
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (i: FieldType) => string },
  adapter?: string,
) {
  return te.run(
    mapper(entity, pack, role, aclAllow, typeMapper, adapter),
    template[adapter],
  );
}

export interface MapperOutput {
  name: string;
  plural?: string;
  strict: boolean | undefined;
  collectionName: string;
  description?: string;
  useDefaultPK: boolean;
  fields: {
    name: string;
    type: string;
    required?: boolean;
  }[];
  relations: {
    name: string;
    type: string;
    required?: boolean;
    primaryKey?: boolean;
  }[];
  indexes?:
    | {
        fields: object;
        options: object;
      }[]
    | object;
}

import {
  getFields,
  mutableFields,
  singleStoredRelationsExistingIn,
  indexes,
  idField,
  memoizeEntityMapper,
} from '../../../queries';

export const mapper = memoizeEntityMapper(template, _mapper);

export function _mapper(
  entity: Entity,
  pack: ModelPackage,
  role: string,
  aclAllow,
  typeMapper: { [key: string]: (i: FieldType) => string },
  adapter: string,
): MapperOutput {
  let ids = getFields(entity)
    .filter(idField)
    .filter(f => f.type !== 'ID');
  let useDefaultPK = ids.length === 0;

  return {
    name: entity.name,
    plural: entity.plural,
    strict: get(entity.metadata, 'storage.schema.strict'),
    collectionName:
      get(entity.metadata, 'storage.collectionName') ||
      entity.plural.toLowerCase(),
    description: entity.description,
    useDefaultPK,
    fields: [
      ...ids.map(f => ({
        name: f.name === 'id' && adapter === 'mongoose' ? '_id' : f.name,
        type: adapter === 'sequelize' ? `${f.type}_pk` : f.type,
        required: true,
        defaultValue: f.defaultValue,
        primaryKey: true,
      })),
      ...getFields(entity).filter(mutableFields),
    ].map(f => {
      return {
        name: f.name,
        type: typeMapper[adapter](f.type),
        required: f.required,
        primaryKey: !!f['primaryKey'],
        defaultValue: f.defaultValue,
      };
    }),
    relations: getFields(entity)
      .filter(singleStoredRelationsExistingIn(pack))
      .filter(r => r.relation.ref.backField !== r.name)
      .map(f => {
        let retKeyType = pack.entities
          .get(f.relation.ref.entity)
          .fields.get(f.relation.ref.field).type;
        return {
          name: f.name,
          type: typeMapper[adapter](retKeyType),
          indexed: true,
          required: !!f.required,
        };
      }),
    indexes: indexes(entity).map(
      i =>
        adapter === 'mongoose'
          ? {
              fields: i.fields,
              options: i.options,
              name: i.name,
            }
          : {
              fields: i.fields,
              options: i.options,
              name: i.name,
            },
    ),
  };
}
