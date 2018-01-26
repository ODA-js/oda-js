import { IModelType, IModelTypeProps } from './IModelType';
import { IField } from './IField';
import { IEntityContext } from './IEntityContext';
import { Map, Set } from 'immutable';
import { IUpdatable } from '../model/Persistent';

export interface IEntityACL {
  read: string[];
  create: string[];
  update: string[];
  delete: string[];
}

export type IEntityIndex = {
  name: string;
  fields: {
    [field: string]: 1 | -1;
  };
  options?: {
    sparse?: boolean;
    unique: boolean;
  };
};

export type IEntityStorage = {
  adapter: 'mongoose' | 'sequelize';
  indexes: {
    [indexName: string]: IEntityIndex;
  }
};

export interface IEntityMetaData {
  acl: Partial<IEntityACL>;
  storage: Partial<IEntityStorage>;
}

export type IEntityPropsStore = Partial<IEntityMetaData> & IModelTypeProps & {
  modelType: 'entity';
  singular: string;
  plural: string;
  fields: Map<string, IField>;
};

export type IEntityProps = Partial<IEntityMetaData> & IModelTypeProps & {
  modelType: 'entity';
  singular: string;
  plural: string;
  fields: IField[];
};

export type IEntityTransform = {
  [k in keyof IEntityProps ]?: {
    transform: (input: IEntityProps[k]) => IEntityPropsStore[k];
    reverse: (input: IEntityPropsStore[k]) => IEntityProps[k];
  }
};

export interface IEntity extends IModelType<IEntityProps, IEntityPropsStore>,
IUpdatable<IEntityProps> {
  readonly modelType: 'entity';
  readonly relations: Set<string>;
  readonly required: Set<string>;
  readonly indexed: Set<string>;
}
