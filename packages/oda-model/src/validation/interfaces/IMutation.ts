import { IModelType, INamedItem } from './IModelType';
import { IValidationResult } from './IValidationResult';
import { IFieldArgs, IField } from './IField';
import { Rule } from '../rule';
import { IMutationContext } from './IMutationContext';
import { IValidator } from './IValidator';
import { Record, Map, Set } from 'immutable';
import { ArrayToMap, ArrayToSet } from '../model/utils';
import { IPackagedItem, IPackagedItemStore, IPackagedItemInit } from './IPackagedItem';
import { IPackage } from './IPackage';

export interface IMutationACL {
  execute: string[];
}

export interface IMutationACLStore {
  execute: Set<string>;
}

export interface IMutationMetaData {
  acl?: IMutationACL;
}

export interface IMutationMetaDataStore {
  acl?: IMutationACLStore;
}

export interface IMutationStore extends IMutationMetaDataStore, INamedItem, IPackagedItemStore {
  args: Map<string, IFieldArgs>;
  payload: Map<string, IFieldArgs>;
}

export interface IMutationInit extends IMutationMetaData, INamedItem, IPackagedItemInit {
  args: IFieldArgs[];
  payload: IFieldArgs[];
  package?: IPackage;
}

export interface IMutationACLTransform {
  execute: ArrayToSet<string>;
}

export interface IMutationTransform {
  args: ArrayToMap<IFieldArgs>;
  payload: ArrayToMap<IFieldArgs>;
  acl: IMutationACLTransform;
}

export interface IMutation extends IModelType, IPackagedItem {
  readonly modelType: 'mutation';
  readonly args: Map<string, IFieldArgs>;
  readonly payload: Map<string, IFieldArgs>;
}

