import { Map, Set } from 'immutable';

import { ArrayToMap, ArrayToSet } from '../model/utils';
import { IFieldArgs } from './IField';
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
  args: Map<string, IFieldArgs>;
  payload: Map<string, IFieldArgs>;
}

export interface IMutationInit extends Partial<IMutationMetaData>, INamedItem, IPackagedItemInit {
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
  readonly acl?: IMutationACLStore;
}

