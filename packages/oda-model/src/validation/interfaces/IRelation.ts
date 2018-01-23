
import { IField } from './IField';
import { IEntityRef } from './IEntityRef';
import { IModelType, IModelTypeProps } from './IModelType';
import { RelationType } from './types';
import { Map } from 'immutable';

export type IRelationPropsStore = IModelTypeProps & {
  verb: RelationType;
  ref: IEntityRef;
  fields?: Map<string, IField>;
  opposite?: string;
};

export type IRelationProps = IModelTypeProps & {
  verb: RelationType;
  ref: IEntityRef;
  fields?: IField[];
  opposite?: string;
};

export type IRelation<TProps extends IRelationProps, TPropsStore extends IRelationPropsStore> = IModelType<TProps, TPropsStore>;
