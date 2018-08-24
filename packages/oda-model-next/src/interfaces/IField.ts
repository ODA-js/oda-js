import { Map } from 'immutable';

import { IContextable } from '../contexts/IContextable';
import { IEntityContext } from '../contexts/IEntityContext';
import { IRelationContext } from '../contexts/IRelationContext';
import { IEntity } from './IEntity';
import { IEntityRef } from './IEntityRef';
import { FieldArgsInput, IFieldArg, IFieldArgInit } from './IFieldArg';
import { IModelType, INamedItem } from './IModelType';
import { IRelation, IRelationInit } from './IRelation';
import { RelationInit, FieldArgsTransform } from './types';

export interface IFieldACL {
  read: string[];
  update: string[];
}

export interface IFieldMetaData {
  acl: IFieldACL;
}

export interface IFieldStorage {
  derived: boolean;
  persistent: boolean;
  required: boolean;
  indexed: boolean | string | string[];
  identity: boolean | string | string[];
}

export interface IFieldInit
  extends Partial<IFieldStorage>,
    Partial<IFieldMetaData>,
    INamedItem {
  entity?: IEntity;
  type?: string;
  args?: FieldArgsInput;
  order?: number;
  relation?: Partial<RelationInit>;
}

export interface IFieldStore extends IFieldStorage, IFieldMetaData, INamedItem {
  entity: IEntity;
  type: string;
  args?: Map<string, IFieldArg>;
  idKey?: IEntityRef;
  order: number;
  relation?: IRelation;
}

export interface IFieldTransform {
  args: FieldArgsTransform;
  relation: {
    transform: (inp: Partial<IRelationInit>, field: IField) => IRelation;
    reverse: (inp: IRelation) => Partial<IRelationInit>;
  };
}

export interface IField
  extends IModelType,
    IContextable<IEntityContext | IRelationContext> {
  readonly modelType: 'field';
  readonly type: string;
  readonly args?: Map<string, IFieldArgInit>;
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
