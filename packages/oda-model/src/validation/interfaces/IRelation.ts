
import { IField } from './IField';
import { IEntityRef } from './IEntityRef';
import { IModelType } from './IModelType';
import { RelationType } from './types';

export interface IRelation extends IModelType {
  verb: RelationType;
  using?: IEntityRef;
  ref: IEntityRef;
  fields?: Map<string, IField>;
  opposite?: string;
}
