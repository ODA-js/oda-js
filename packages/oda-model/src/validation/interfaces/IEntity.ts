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
  IUpdatable<IEntityProps> {
  readonly modelType: 'entity';
  readonly relations: Set<string>;
  readonly required: Set<string>;
  readonly indexed: Set<string>;
}
