import { Map } from 'immutable';

import { ArrayToMap } from '../model/utils';
import { IEntity } from './IEntity';
import { IEntityRef } from './IEntityRef';
import { IModelType, INamedItem } from './IModelType';
import { IRelation, IRelationInit } from './IRelation';
import { RelationInit } from './types';

export interface IFieldACL {
  read: string[];
  update: string[];
}

export interface IFieldMetaData {
  acl: IFieldACL;
}

export interface IFieldArgs {
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface IFieldStorage {
  derived: boolean;
  persistent: boolean;
  required: boolean;
  indexed: boolean | string | string[];
  identity: boolean | string | string[];
}

export interface IFieldInit extends Partial<IFieldStorage>, Partial<IFieldMetaData>, Partial<INamedItem> {
  entity?: IEntity;
  type?: string;
  args?: IFieldArgs[];
  order?: number;
  relation?: Partial<RelationInit>;
}

export interface IFieldStore extends IFieldStorage, IFieldMetaData, INamedItem {
  entity: IEntity;
  type: string;
  args?: Map<string, IFieldArgs>;
  idKey?: IEntityRef;
  order: number;
  relation?: IRelation;
}

export interface IFieldTransform {
  args: ArrayToMap<IFieldArgs>;
  relation: {
    transform: (inp: Partial<IRelationInit>) => IRelation,
    reverse: (inp: IRelation) => Partial<IRelationInit>,
  };
}

export interface IField extends IModelType {
  readonly modelType: 'field';
  readonly entity: IEntity;
  readonly type: string;
  readonly args?: Map<string, IFieldArgs>;
  readonly idKey?: IEntityRef;
  readonly order: number;
  readonly relation: IRelation;
  readonly derived: boolean;
  readonly persistent: boolean;
  readonly required: boolean;
  readonly indexed: boolean | string | string[];
  readonly identity: boolean | string | string[];
  readonly acl: Partial<IFieldACL>;
}
