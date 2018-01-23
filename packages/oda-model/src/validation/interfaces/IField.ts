import { IEntityRef } from './IEntityRef';
import { IModelType, IModelTypeProps } from './IModelType';
import { Relation } from './types';

export type FieldACL = {
  read: string[];
  update: string[];
};

export type FieldMetaData = {
  acl: Partial<FieldACL>;
};

export interface IFieldArgs {
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export type IFieldProps = FieldMetaData & IModelTypeProps &{
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
  relation?: Relation;
};

export interface IField extends IModelType<IFieldProps, IFieldProps> {
  readonly modelType: 'field';
}
