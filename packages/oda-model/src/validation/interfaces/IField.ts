import { IModelType } from './IModelType';
import { IRelation } from './IRelation';
import { IEntityRef } from './IEntityRef';

export interface IFieldArgs {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
}

export interface IField extends IModelType {
  modelType: 'field';
  entity?: string;
  type?: string;
  args: IFieldArgs[];
  derived?: boolean;
  persistent?: boolean;
  required?: boolean;
  indexed?: boolean | string | string[];
  identity?: boolean | string | string[];
  idKey?: IEntityRef;
  order?: number;
  relation?: IRelation;
}
