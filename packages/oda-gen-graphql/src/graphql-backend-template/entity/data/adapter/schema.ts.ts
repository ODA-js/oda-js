import { Entity, ModelPackage } from 'oda-model';
import { mapToMongooseTypes, mapToSequelizeTypes } from '../../../utils';
import { Factory } from 'fte.js';
import { utils } from 'oda-api-graphql';
let get = utils.get;

const typeMapper = {
  mongoose: mapToMongooseTypes,
  sequelize: mapToSequelizeTypes,
};

export const template = {
  mongoose: 'entity/data/mongoose/schema.ts.njs',
  sequelize: 'entity/data/sequelize/schema.ts.njs',
};

export function generate(te: Factory, entity: Entity, pack: ModelPackage) {
  let adapter = entity.getMetadata('storage.adapter', 'mongoose');
  return te.run(mapper(entity, pack, adapter), template[adapter]);
}

export interface MapperOutupt {
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
  indexes?: {
    fields: object;
    options: object;
  }[] | object;
}

import {
  getFields,
  mutableFields,
  singleStoredRelationsExistingIn,
  indexes,
  idField,
} from '../../../queries';

export function mapper(entity: Entity, pack: ModelPackage, adapter: string): MapperOutupt {
  let ids = getFields(entity).filter(idField).filter(f => f.type !== 'ID');
  let useDefaultPK = ids.length === 0;

  return {
    name: entity.name,
    plural: entity.plural,
    strict: get(entity.metadata, 'storage.schema.strict'),
    collectionName: get(entity.metadata, 'storage.collectionName') || entity.plural.toLowerCase(),
    description: entity.description,
    useDefaultPK,
    fields: [
      ...ids.map(f => ({
        name: (f.name === 'id' && adapter === 'mongoose') ? '_id' : f.name,
        type: f.type,
        required: false,
        primaryKey: true,
      })),
      ...getFields(entity)
        .filter(mutableFields)]
      .map(f => {
        return {
          name: f.name,
          type: typeMapper[adapter](f.type),
          required: f.required,
          primaryKey: !!f['primaryKey'],
        };
      }),
    relations: getFields(entity)
      .filter(singleStoredRelationsExistingIn(pack))
      .map(f => {
        let retKeyType = pack.entities.get(f.relation.ref.entity).fields.get(f.relation.ref.field).type;
        return {
          name: f.name,
          type: typeMapper[adapter](retKeyType),
          indexed: true,
          required: f.required,
        };
      }),
    indexes: indexes(entity).map(i => adapter === 'mongoose' ? ({
      fields: i.fields,
      options: i.options,
    }) : ({
      fields: i.fields,
      options: i.options,
    })),
  };
}
