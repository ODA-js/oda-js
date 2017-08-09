import { Entity, ModelPackage } from 'oda-model';
import { mapToMongooseTypes } from '../../../utils';
import { Factory } from 'fte.js';
import { utils } from 'oda-api-graphql';
let get = utils.get;

export const template = 'entity/data/mongoose/schema.ts.njs';

export function generate(te: Factory, entity: Entity, pack: ModelPackage) {
  return te.run(mapper(entity, pack), template);
}

export interface MapperOutupt {
  name: string;
  plural?: string;
  strict: boolean | undefined;
  collectionName: string;
  description?: string;
  fields: {
    name: string;
    type: string;
    required?: boolean;
  }[];
  relations: {
    name: string;
    type: string;
    required?: boolean;
  }[];
  indexes?: {
    fields: object;
    options: object;
  }[];
}

import {
  getFields,
  mutableFields,
  singleStoredRelationsExistingIn,
  indexes,
  idField,
} from '../../../queries';

export function mapper(entity: Entity, pack: ModelPackage): MapperOutupt {
  let ids = getFields(entity).filter(idField);
  return {
    name: entity.name,
    plural: entity.plural,
    strict: get(entity.metadata, 'storage.schema.strict'),
    collectionName: get(entity.metadata, 'storage.collectionName') || entity.plural.toLowerCase(),
    description: entity.description,
    fields: [
      ...ids.map(f => ({
        name: f.name === 'id' ? '_id' : f.name,
        type: f.type,
        required: false,
      })).filter(f => f.type !== 'ID'),
      ...getFields(entity)
        .filter(mutableFields)]
      .map(f => {
        return {
          name: f.name,
          type: mapToMongooseTypes(f.type),
          required: f.required,
        };
      }),
    relations: getFields(entity)
      .filter(singleStoredRelationsExistingIn(pack))
      .map(f => {
        let retKeyType = pack.entities.get(f.relation.ref.entity).fields.get(f.relation.ref.field).type;
        return {
          name: f.name,
          type: mapToMongooseTypes(retKeyType),
          indexed: true,
          required: f.required,
        };
      }),
    indexes: indexes(entity).map(i => ({
      fields: i.fields,
      options: i.options,
    })),
  };
}
