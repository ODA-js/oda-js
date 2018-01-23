import { IModelType, IModelTypeProps } from './IModelType';
import { IField } from './IField';
import { IEntityContext } from './IEntityContext';

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

export type EntityName = {
  singular: string;
  plural: string;
};

export type EntityMetaData = {
  acl: Partial<EntityACL>;
  storage: Partial<EntityStorage>;
  name: Partial<EntityName>;
};

export type EntityPropsStore = Partial<EntityMetaData> & IModelTypeProps & {
  plural: string;
  relations: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
  fields: Map<string, IField>;
};

export type EntityProps = Partial<EntityMetaData> & IModelTypeProps & {
  plural: string;
  fields: IField[];
};

export interface IEntity extends IModelType<EntityProps, EntityPropsStore> {
  readonly modelType: 'entity';
}
