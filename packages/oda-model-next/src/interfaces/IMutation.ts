import { Map, Set } from 'immutable';

import { IContextable } from '../contexts/IContextable';
import { IPackageContext } from '../contexts/IPackageContext';
import { ArrayToSet } from '../model/utils';
import { FieldArgsInput, IFieldArg, IFieldArgInit } from './IFieldArg';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, IPackagedItemStore } from './IPackagedItem';
import { FieldArgsTransform } from './types';

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
}

export interface IMutationACLTransform {
  execute: ArrayToSet<string>;
}

export interface IMutationTransform {
  args: FieldArgsTransform;
  payload: FieldArgsTransform;
  acl: IMutationACLTransform;
}

export interface IMutation extends IModelType, IPackagedItem, IContextable<IPackageContext> {
  readonly modelType: 'mutation';
  readonly args: Map<string, IFieldArgInit>;
  readonly payload: Map<string, IFieldArgInit>;
  readonly acl?: IMutationACLStore;
}

