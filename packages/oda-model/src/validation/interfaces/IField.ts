import { Map } from 'immutable';

import { IEntityRef } from './IEntityRef';
import { IModelType, IModelTypeProps } from './IModelType';
import { RelationUnion, RelationPropsUnion } from './types';
import { IUpdatable } from '../model/Persistent';
import { ArrayToMap } from '../model/utils';

export interface IFieldACL {
  read?: string[];
  update?: string[];
}

export interface IFieldMetaData {
  acl: IFieldACL;
}

export interface IFieldArgs {
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface IFieldStorage {
  derived?: boolean;
  persistent?: boolean;
  required?: boolean;
  indexed?: boolean | string | string[];
  identity?: boolean | string | string[];
}

export interface IFieldProps extends IFieldStorage, IFieldMetaData, IModelTypeProps {
  entity?: string;
  type?: string;
  args: IFieldArgs[];
  order?: number;
  relation?: RelationPropsUnion;
}

export interface IFieldPropsStore extends IFieldStorage, IFieldMetaData, IModelTypeProps {
  entity?: string;
  type?: string;
  args: Map<string, IFieldArgs>;
  idKey?: IEntityRef;
  order?: number;
  relation?: RelationUnion;
}

export type IFieldTransform = {
  args: ArrayToMap<IFieldArgs>;
  relation: {
    transform: (inp: RelationPropsUnion) => RelationUnion,
    reverse: (inp: RelationUnion) => RelationPropsUnion,
  }
};

export interface IField extends IModelType, IUpdatable<IFieldProps>, IFieldPropsStore {
  readonly modelType: 'field';
}
