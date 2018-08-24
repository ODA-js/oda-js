import { Map, Set } from 'immutable';

import { IContextable } from '../contexts/IContextable';
import { IPackageContext } from '../contexts/IPackageContext';
import { IField, IFieldInit } from './IField';
import { IModelType, INamedItem } from './IModelType';
import {
  IPackagedItem,
  IPackagedItemInit,
  IPackagedItemStore,
} from './IPackagedItem';
import { FieldTransformType } from './types';

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

export interface IEntityStore
  extends IEntityMetaData,
    INamedItem,
    IPackagedItemStore {
  singular: string;
  plural: string;
  fields: Map<string, IField>;
  relations: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
}

export interface IEntityInit
  extends Partial<IEntityMetaData>,
    INamedItem,
    IPackagedItemInit {
  singular?: string;
  plural?: string;
  fields?:
    | {
        [name: string]: Partial<IFieldInit>;
      }
    | IFieldInit[];
}

export interface IEntityTransform {
  fields: FieldTransformType;
}

export interface IEntity
  extends IModelType,
    IPackagedItem,
    IContextable<IPackageContext> {
  readonly modelType: 'entity';
  readonly singular: string;
  readonly plural: string;
  readonly fields: Map<string, IField>;
  readonly relations: Set<string>;
  readonly required: Set<string>;
  readonly indexed: Set<string>;
}
