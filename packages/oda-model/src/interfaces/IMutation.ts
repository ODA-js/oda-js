import { Map, Set } from 'immutable';

import { ArrayToMap, ArrayToSet, MapType } from '../model/utils';
import { IFieldArgInit, IFieldArg, FieldArgsInput } from './IFieldArg';
import { IModelType, INamedItem } from './IModelType';
import { IPackage } from './IPackage';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';
import { FieldArgsTransformType } from './types';

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
  args: FieldArgsInput;
  payload: FieldArgsInput;
  package?: IPackage;
}

export interface IMutationACLTransform {
  execute: ArrayToSet<string>;
}

export interface IMutationTransform {
  args: FieldArgsTransformType;
  payload: FieldArgsTransformType;
  acl: IMutationACLTransform;
}

export interface IMutation extends IModelType, IPackagedItem {
  readonly modelType: 'mutation';
  readonly args: Map<string, IFieldArgInit>;
  readonly payload: Map<string, IFieldArgInit>;
  readonly acl?: IMutationACLStore;
}

