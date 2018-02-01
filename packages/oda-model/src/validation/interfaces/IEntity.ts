import { IModelType, INamedItem } from './IModelType';
import { IField, IFieldInit } from './IField';
import { IEntityContext } from './IEntityContext';
import { Map, Set } from 'immutable';
import { ArrayToMap, ConvertToMap } from '../model/utils';
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

export interface IEntityStore extends IEntityMetaData, INamedItem, IPackagedItemStore {
  singular: string;
  plural: string;
  fields: Map<string, IField>;
  relations: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
}

export interface IEntityInput extends Partial<IEntityMetaData>, Partial<INamedItem>, Partial<IPackagedItemInit> {
  singular?: string;
  plural?: string;
  fields: {
    [name: string]: Partial<IFieldInit>,
  } | Partial<IFieldInit>[];
  package?: IPackage;
}

export interface IEntityInit extends Partial<IEntityMetaData>, Partial<INamedItem>, Partial<IPackagedItemInit> {
  singular?: string;
  plural?: string;
  fields: Partial<IFieldInit>[];
  package?: IPackage;
}

export interface IEntityTransform {
  fields: ConvertToMap<IFieldInit, IField>;
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
