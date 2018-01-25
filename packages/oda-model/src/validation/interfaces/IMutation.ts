import { IModelType, IModelTypeProps } from './IModelType';
import { IValidationResult } from './IValidationResult';
import { IFieldArgs } from './IField';
import { Rule } from '../rule';
import { IMutationContext } from './IMutationContext';
import { IValidator } from './IValidator';
import { Record, Map, Set } from 'immutable';
import { IUpdatable } from '../model/Persistent';

export interface IMutationACL {
  readonly execute: string[];
}

export interface IMutationACLStore {
  readonly execute: Set<string>;
}

export interface IMutationMetaData {
  readonly acl?: IMutationACL;
}

export interface IMutationMetaDataStore {
  readonly acl?: IMutationACLStore;
}

export type IMutationPropsStore = IMutationMetaDataStore & IModelTypeProps & {
  args: Map<string, IFieldArgs>;
  payload: Map<string, IFieldArgs>;
};

export type IMutationProps = IMutationMetaData & IModelTypeProps & {
  args: IFieldArgs[];
  payload: IFieldArgs[];
};

export type IMutationTransform = {
  [k in keyof IMutationProps]?: {
    transform: (input: IMutationProps[k]) => IMutationPropsStore[k];
    reverse: (input: IMutationPropsStore[k]) => IMutationProps[k];
  }
};

export interface IMutation extends IModelType<IMutationProps, IMutationPropsStore>, IUpdatable<IMutationProps> {
  readonly modelType: 'mutation';
}

