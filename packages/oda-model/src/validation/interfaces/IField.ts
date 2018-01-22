import { IModelType, IModelTypeProps } from './IModelType';
import { IRelation } from './IRelation';
import { IEntityRef } from './IEntityRef';

export interface IFieldArgs {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
}

export type IFieldProps = IModelTypeProps &{
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
};

export interface IField extends IModelType<IFieldProps> {
  readonly modelType: 'field';
}
