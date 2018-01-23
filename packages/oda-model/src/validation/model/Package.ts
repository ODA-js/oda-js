import {IModel} from '../interfaces/IModel';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';
import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import { IPackagePropsStored } from '../interfaces/IPackage';
import {ModelItem} from '../interfaces/types';

// tslint:disable-next-line:variable-name
export const DefaultPackage: IPackagePropsStored = {
  modelType: 'package',
  name: null,
  title: null,
  description: null,
  acl: null,
  abstract: null,
  items: null,
  model: null,
};

// tslint:disable-next-line:variable-name
export const MutationTransform = {
  items: transformMap<ModelItem>(),
};
