import { Record } from 'immutable';
import { Map } from 'immutable';

import { IModel } from '../interfaces/IModel';
import { IModelType } from '../interfaces/IModelType';
import { IPackage, IPackageInit, IPackageStore, IPackageTransform } from '../interfaces/IPackage';
import { Persistent } from './Persistent';
import { transformMap } from './utils';
import { IPackagedItem } from '../interfaces/IPackagedItem';

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
  items: {
    transform: (input?: IPackagedItem[]) => {
      if (input) {
        return Map<string, IPackagedItem>(input.map(p => [p.name, p]) as [string, IPackagedItem][]);
      } else {
        return null;
      }
    },
    reverse: (input?: Map<string, IPackagedItem>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(f => f.toJS() as IPackagedItem);
      } else {
        return null;
      }
    },
  },
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

  protected transform(input: Partial<IPackageInit>): IPackageStore {
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

  protected reverse(input: Record<IPackageStore>): IPackageInit {
    const result: IPackageInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'items') {
            result.items = PackageTransform.items.reverse(input.get(f, null));
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }

  constructor(init: Partial<IPackageInit> = {}) {
    super();
    this.store = new PackageStorage(this.transform(init));
    this.init = new (Record<Partial<IPackageInit>>(init))();
  }
}
