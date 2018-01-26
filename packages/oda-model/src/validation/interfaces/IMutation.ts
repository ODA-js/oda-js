import { IModelType, IModelTypeProps } from './IModelType';
import { IValidationResult } from './IValidationResult';
import { IFieldArgs, IField } from './IField';
import { Rule } from '../rule';
import { IMutationContext } from './IMutationContext';
import { IValidator } from './IValidator';
import { Record, Map, Set } from 'immutable';
import { IUpdatable } from '../model/Persistent';
import { ArrayToMap, ArrayToSet } from '../model/utils';

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

export interface IMutationPropsStore extends IMutationMetaDataStore, IModelTypeProps {
  args: Map<string, IFieldArgs>;
  payload: Map<string, IFieldArgs>;
}

export interface IMutationProps extends IMutationMetaData, IModelTypeProps {
  args: IFieldArgs[];
  payload: IFieldArgs[];
}

export interface IMutationACLTransform {
  execute: ArrayToSet<string>;
}

export interface IMutationTransform {
  args: ArrayToMap<IFieldArgs>;
  payload: ArrayToMap<IFieldArgs>;
  acl: IMutationACLTransform;
}

export interface IMutation extends IModelType, IUpdatable<IMutationProps> {
  readonly modelType: 'mutation';
}

