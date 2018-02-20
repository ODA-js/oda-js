import { Map } from 'immutable';

import { IEntityRef } from './IEntityRef';
import { IField, IFieldInit } from './IField';
import { IModelType, INamedItem } from './IModelType';
import { MetaModelType, RelationType } from './types';
import { IFieldContext } from '../contexts/IFieldContext';


// metadata attributes
export interface IRelationStorage {
  single: boolean;
  stored: boolean;
  embedded: boolean;
}

export interface IRelationName {
  fullName: string;
  normalName: string;
  shortName: string;
}
// props
export interface IRelationStore extends IRelationName, IRelationStorage, INamedItem {
  opposite: string;
  fields: Map<string, IField>;
  context: IFieldContext;
}

export interface IRelationInit extends Partial<IRelationName>, Partial<IRelationStorage>, Partial<INamedItem> {
  opposite: string;
  fields?: {
    [name: string]: Partial<IFieldInit>,
  } | IFieldInit[];
  context: IFieldContext;
}

export interface IRelation extends IModelType {
  readonly single: boolean;
  readonly stored: boolean;
  readonly embedded: boolean;
  readonly fullName: string;
  readonly normalName: string;
  readonly shortName: string;
  readonly modelType: MetaModelType;
  readonly verb: RelationType;
  readonly ref: IEntityRef;
  readonly opposite?: string;
  readonly fields?: Map<string, IField>;
  readonly context: IFieldContext;
}
