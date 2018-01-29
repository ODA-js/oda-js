import { IModelType, IModelTypeProps } from './IModelType';
import { IField } from './IField';
import { IEntityContext } from './IEntityContext';
import { Map, Set } from 'immutable';
import { IUpdatable } from '../model/Persistent';
import { ArrayToMap } from '../model/utils';

export interface IEntityACL {
  read?: string[];
  create?: string[];
  update?: string[];
  delete?: string[];
}

export interface IEntityIndex {
  name: string;
  fields: {
    [field: string]: 1 | -1;
  };
  options?: {
    sparse?: boolean;
    unique: boolean;
  };
}

export interface IEntityStorage {
  adapter?: 'mongoose' | 'sequelize';
  indexes?: {
    [indexName: string]: IEntityIndex;
  };
}

export interface IEntityMetaData {
  acl: IEntityACL;
  storage: IEntityStorage;
}

export interface IEntityPropsStore extends Partial<IEntityMetaData>, IModelTypeProps {
  modelType: 'entity';
  singular: string;
  plural: string;
  fields: Map<string, IField>;
  relations: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
}

export interface IEntityProps extends Partial<IEntityMetaData>, IModelTypeProps {
  modelType: 'entity';
  singular: string;
  plural: string;
  fields: IField[];
}

export interface IEntityTransform {
  fields: ArrayToMap<IField>;
}

export interface IEntity extends IModelType,
  IUpdatable<IEntityProps>, IEntityPropsStore {
  readonly modelType: 'entity';
}
