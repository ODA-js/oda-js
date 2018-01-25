
import { IField } from './IField';
import { IEntityRef } from './IEntityRef';
import { IModelType, IModelTypeProps } from './IModelType';
import { RelationType, MetaModelType } from './types';
import { Map } from 'immutable';

export type RelationStorage = {
  single: boolean;
  stored: boolean;
  embedded: boolean;
};

export type RelationName = {
  fullName: string;
  normalName: string;
  shortName: string;
};

export type IRelationPropsStore = RelationName & RelationStorage & IModelTypeProps & {
  modelType: MetaModelType;
  ref: IEntityRef;
  fields?: Map<string, IField>;
  opposite?: string;
  verb: RelationType;
};

export type IRelationProps = RelationName & IModelTypeProps & {
  modelType: MetaModelType;
  verb: RelationType;
  ref: IEntityRef;
  fields?: IField[];
  opposite?: string;
};

export type IRelation<TProps extends IRelationProps, TPropsStore extends IRelationPropsStore> = IModelType<TProps, TPropsStore>;
