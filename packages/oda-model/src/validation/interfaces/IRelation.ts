
import { IField } from './IField';
import { IEntityRef } from './IEntityRef';
import { IModelType, IModelTypeProps } from './IModelType';
import { RelationType } from './types';

export type IRelationProps = IModelTypeProps & {
  verb: RelationType;
  ref: IEntityRef;
  fields?: Map<string, IField>;
  opposite?: string;
};

export type IRelation<TProps extends IRelationProps> = IModelType<TProps>;
