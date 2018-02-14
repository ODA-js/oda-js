import { Map, Set } from 'immutable';

import { ArrayToMap, ArrayToSet } from '../model/utils';
import { IFieldArg } from './IFieldArg';
import { IModelType, INamedItem } from './IModelType';
import { IPackage } from './IPackage';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';

export interface IMutationACL {
  execute: string[];
}

export interface IMutationMetaData {
  acl?: IMutationACL;
}

export interface IMutationACLStore {
  execute: Set<string>;
}

export interface IMutationMetaDataStore {
  acl?: IMutationACLStore;
}

export interface IMutationStore extends IMutationMetaDataStore, INamedItem, IPackagedItemStore {
  args: Map<string, IFieldArg>;
  payload: Map<string, IFieldArg>;
}

export interface IMutationInit extends Partial<IMutationMetaData>, INamedItem, IPackagedItemInit {
  args: IFieldArg[];
  payload: IFieldArg[];
  package?: IPackage;
}

export interface IMutationACLTransform {
  execute: ArrayToSet<string>;
}

export interface IMutationTransform {
  args: ArrayToMap<IFieldArg>;
  payload: ArrayToMap<IFieldArg>;
  acl: IMutationACLTransform;
}

export interface IMutation extends IModelType, IPackagedItem {
  readonly modelType: 'mutation';
  readonly args: Map<string, IFieldArg>;
  readonly payload: Map<string, IFieldArg>;
  readonly acl?: IMutationACLStore;
}

