import { Map } from 'immutable';

import { IEntityRef } from './IEntityRef';
import { IModelType, INamedItem } from './IModelType';
import { RelationUnion, RelationPropsUnion } from './types';
import { ArrayToMap } from '../model/utils';
import { IRelation, IRelationInit, IRelationStore } from './IRelation';

export interface IFieldACL {
  read?: string[];
  update?: string[];
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
  derived?: boolean;
  persistent?: boolean;
  required?: boolean;
  indexed?: boolean | string | string[];
  identity?: boolean | string | string[];
}

export interface IFieldInit extends IFieldStorage, IFieldMetaData, INamedItem {
  entity?: string;
  type?: string;
  args: IFieldArgs[];
  order?: number;
  relation?: IRelationInit;
}

export interface IFieldStore extends IFieldStorage, IFieldMetaData, INamedItem {
  entity?: string;
  type?: string;
  args: Map<string, IFieldArgs>;
  idKey?: IEntityRef;
  order?: number;
  relation?: IRelation;
}

export interface IFieldTransform {
  args: ArrayToMap<IFieldArgs>;
  relation: {
    transform: (inp: RelationPropsUnion) => RelationUnion,
    reverse: (inp: RelationUnion) => RelationPropsUnion,
  };
}

export interface IField extends IModelType {
  readonly modelType: 'field';
  readonly entity?: string;
  readonly type?: string;
  readonly args: Map<string, IFieldArgs>;
  readonly idKey?: IEntityRef;
  readonly order?: number;
  readonly relation?: RelationUnion;
}
