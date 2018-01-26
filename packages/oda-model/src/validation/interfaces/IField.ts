import { Map } from 'immutable';

import { IEntityRef } from './IEntityRef';
import { IModelType, IModelTypeProps } from './IModelType';
import { Relation } from './types';
import { IUpdatable } from '../model/Persistent';

export interface IFieldACL {
  read?: string[];
  update?: string[];
}

export interface IFieldMetaData  {
  acl: IFieldACL;
}

export interface IFieldArgs {
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface IFieldProps extends IFieldMetaData, IModelTypeProps {
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
}

export interface IFieldPropsStore extends IFieldMetaData , IModelTypeProps  {
  entity?: string;
  type?: string;
  args: Map<string, IFieldArgs>;
  derived?: boolean;
  persistent?: boolean;
  required?: boolean;
  indexed?: boolean | string | string[];
  identity?: boolean | string | string[];
  idKey?: IEntityRef;
  order?: number;
  relation?: Relation;
}

export type IFieldTransform = {
  [k in keyof IFieldProps]?: {
    transform: (input: IFieldProps[k]) => IFieldPropsStore[k];
    reverse: (input: IFieldPropsStore[k]) => IFieldProps[k];
  }
};

export interface IField
  extends IModelType<IFieldProps, IFieldPropsStore>,
  IUpdatable<IFieldProps> {
  readonly modelType: 'field';
}
