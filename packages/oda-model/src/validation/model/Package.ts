import { Record } from 'immutable';
import { Map } from 'immutable';

import { IModel } from '../interfaces/IModel';
import { IModelType } from '../interfaces/IModelType';
import { IPackage, IPackageInit, IPackageStore, IPackageTransform } from '../interfaces/IPackage';
import { Persistent } from './Persistent';
import { transformMap } from './utils';
import {IPackagedItem } from '../interfaces/IPackagedItem';

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
  items: transformMap<IPackagedItem>(),
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
  public get items(): Map<string, IPackagedItem> {
    return this.store.get('items', null);
  }
  public get model(): IModel {
    return this.store.get('model', null);
  }

  protected transform(input: IPackageInit): IPackageStore {
    const result: IPackageStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'items') {
            result.items = PackageTransform.items.transform(input.items);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(input: IPackageStore): IPackageInit {
    const result: IPackageInit = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'items') {
            result.items = PackageTransform.items.reverse(input.items);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  constructor(init: IPackageInit) {
    super();
    this.store = new PackageStorage(this.transform(init));
    this.init = new (Record<IPackageInit>(init))();
  }
}
