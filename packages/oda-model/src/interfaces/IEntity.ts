import { Map, Set } from 'immutable';

import { IField, IFieldInit } from './IField';
import { IModelType, INamedItem } from './IModelType';
import { IPackage } from './IPackage';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';

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

export interface IEntityInit extends Partial<IEntityMetaData>, INamedItem, IPackagedItemInit {
  singular?: string;
  plural?: string;
  fields?: {
    [name: string]: IFieldInit,
  } | IFieldInit[];
  package?: IPackage;
}

export interface IEntityTransform {
  fields: {
    transform: (input: {
      [name: string]: IFieldInit,
    } | IFieldInit[]) => Map<string, IField>;
    reverse: (input:  Map<string, IField>) => IFieldInit[];
  };
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
