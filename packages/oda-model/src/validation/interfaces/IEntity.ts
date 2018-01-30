import { IModelType, INamedItem } from './IModelType';
import { IField } from './IField';
import { IEntityContext } from './IEntityContext';
import { Map, Set } from 'immutable';
import { ArrayToMap } from '../model/utils';
import { IPackagedItem, IPackagedItemStore, IPackagedItemInit } from './IPackagedItem';
import { IPackage } from './IPackage';

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

export interface IEntityStore extends Partial<IEntityMetaData>, INamedItem, IPackagedItemStore {
  modelType: 'entity';
  singular: string;
  plural: string;
  fields: Map<string, IField>;
  relations: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
}

export interface IEntityInit extends Partial<IEntityMetaData>, INamedItem, IPackagedItemInit {
  modelType: 'entity';
  singular: string;
  plural: string;
  fields: IField[];
  package?: IPackage;
}

export interface IEntityTransform {
  fields: ArrayToMap<IField>;
}

export interface IEntity extends IModelType, IPackagedItem {
  readonly modelType: 'entity';
  readonly singular: string;
  readonly plural: string;
  readonly fields: Map<string, IField>;
  readonly relations: Set<string>;
  readonly required: Set<string>;
  readonly indexed: Set<string>;
}
