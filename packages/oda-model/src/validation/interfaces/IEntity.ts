import { IModelType, IModelTypeProps } from './IModelType';
import { IField } from './IField';
import { IEntityContext } from './IEntityContext';
import { Map, Set } from 'immutable';

export type EntityACL = {
  read: string[];
  create: string[];
  update: string[];
  delete: string[];
};

export type EntityIndex = {
  name: string;
  fields: {
    [field: string]: 1 | -1;
  };
  options?: {
    sparse?: boolean;
    unique: boolean;
  };
};

export type EntityStorage = {
  adapter: 'mongoose' | 'sequelize';
  indexes: {
    [indexName: string]: EntityIndex;
  }
};

export type EntityMetaData = {
  acl: Partial<EntityACL>;
  storage: Partial<EntityStorage>;
};

export type EntityPropsStore = Partial<EntityMetaData> & IModelTypeProps & {
  modelType: 'entity';
  singular: string;
  plural: string;
  fields: Map<string, IField>;
  relations: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
};

export type EntityProps = Partial<EntityMetaData> & IModelTypeProps & {
  modelType: 'entity';
  singular: string;
  plural: string;
  fields: IField[];
};

export interface IEntity extends IModelType<EntityProps, EntityPropsStore> {
  readonly modelType: 'entity';
}
