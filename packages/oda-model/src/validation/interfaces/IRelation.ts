
import { IField } from './IField';
import { IEntityRef } from './IEntityRef';
import { IModelType, IModelTypeProps } from './IModelType';
import { RelationType, MetaModelType } from './types';
import { Map } from 'immutable';

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

export interface IRelationPropsStore extends IRelationName , IRelationStorage , IModelTypeProps  {
  modelType: MetaModelType;
  ref: IEntityRef;
  fields?: Map<string, IField>;
  opposite?: string;
  verb: RelationType;
}

export interface IRelationProps extends IRelationName , IModelTypeProps  {
  modelType: MetaModelType;
  verb: RelationType;
  ref: IEntityRef;
  fields?: IField[];
  opposite?: string;
}

export type IRelationTransform = {
  [k in keyof IRelationProps]?: {
    transform: (input: IRelationProps[k]) => IRelationPropsStore[k];
    reverse: (input: IRelationPropsStore[k]) => IRelationProps[k];
  }
};

export type IRelation<TProps extends IRelationProps, TPropsStore extends IRelationPropsStore> = IModelType<TProps, TPropsStore>;
