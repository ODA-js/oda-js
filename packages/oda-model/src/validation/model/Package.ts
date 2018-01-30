import { IModel } from '../interfaces/IModel';
import { Record } from 'immutable';
import { Map, Set } from 'immutable';
import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import {
  IPackageStore,
  IPackageInit,
  IPackage,
  IPackageTransform,
} from '../interfaces/IPackage';
import { ModelItem } from '../interfaces/types';
import { IModelType } from '../interfaces/IModelType';

// tslint:disable-next-line:variable-name
export const DefaultPackage: IPackageStore = {
  name: null,
  title: null,
  description: null,
  acl: null,
  abstract: null,
  items: null,
  model: null,
};

// tslint:disable-next-line:variable-name
export const PackageTransform: IPackageTransform = {
  items: transformMap<IModelType>(),
};

// tslint:disable-next-line:variable-name
const PackageStorage = Record(DefaultPackage);

export class Package extends Persistent<IPackageInit, IPackageStore> implements IPackage {
  public get modelType(): 'package' {
    return 'package';
  }
  public get name(): string {
    return this.store.get('name', null);
  }
  public get description(): string {
    return this.store.get('description', null);
  }
  public get abstract(): boolean {
    return this.store.get('abstract', null);
  }
  public get title(): string {
    return this.store.get('title', null);
  }
  public get acl(): number {
    return this.store.get('acl', null);
  }
  public get items(): Map<string, IModelType> {
    return this.store.get('items', null);
  }
  public get model(): IModel {
    return this.store.get('model', null);
  }

  protected transform(input: IPackageInit): IPackageStore {
    return {
      ...input,
      items: PackageTransform.items.transform(input.items),
    };
  }

  protected reverse(input: IPackageStore): IPackageInit {
    return {
      ...input,
      items: PackageTransform.items.reverse(input.items),
    };
  }

  constructor(init: IPackageInit) {
    super();
    this.store = new PackageStorage(this.transform(init));
    this.init = new (Record<IPackageInit>(init))();
  }
}
