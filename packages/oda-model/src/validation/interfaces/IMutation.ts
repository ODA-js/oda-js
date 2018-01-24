import { IModelType, IModelTypeProps } from './IModelType';
import { IValidationResult } from './IValidationResult';
import { IFieldArgs } from './IField';
import { Rule } from '../rule';
import { IMutationContext } from './IMutationContext';
import { IValidator } from './IValidator';
import { Record, Map, Set } from 'immutable';

export interface IMutationACL {
  readonly execute: string[];
}

export interface IMutationACLStored {
  readonly execute: Set<string>;
}

export interface IMutationMetaData {
  readonly acl?: IMutationACL;
}

export interface IMutationMetaDataStored {
  readonly acl?: IMutationACLStored;
}

export type IMutationPropsStored = IMutationMetaDataStored & IModelTypeProps & {
  modelType: 'mutation';
  args: Map<string, IFieldArgs>;
  payload: Map<string, IFieldArgs>;
};

export type IMutationProps = IMutationMetaData & IModelTypeProps & {
  modelType: 'mutation';
  args: IFieldArgs[];
  payload: IFieldArgs[];
};

export interface IMutation extends IModelType<IMutationProps, IMutationPropsStored> {
  readonly modelType: 'mutation';
}

