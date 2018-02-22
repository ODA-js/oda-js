import { Map, Record } from 'immutable';

import { IModelContext } from '../contexts/IModelContext';
import { IPackage, IPackageInit, IPackageStore, IPackageTransform } from '../interfaces/IPackage';
import { IPackagedItem, IPackagedItemInit, PackagedItemInit } from '../interfaces/IPackagedItem';
import { Persistent } from './Persistent';

// tslint:disable-next-line:variable-name
export const DefaultPackage: IPackageStore = {
  name: null,
  title: null,
  description: null,
  acl: null,
  abstract: null,
  items: null,
};

// tslint:disable-next-line:variable-name
export const PackageTransform: IPackageTransform = {
  items: {
    transform: (input: PackagedItemInit[], pkg: Package) => {
      if (input) {
        return Map<string, IPackagedItem>(input.map(p => {
          if (typeof p === 'string') {
            if (pkg.context.model.defaultPackage.items.has(p)) {
              return [p, {
                ...pkg.context.model.defaultPackage.items.get(p),
                package: pkg,
              }];
            } else {
              throw Error('item does not exists');
            }
          } else {
            return [p.name, {
              ...p,
              package: pkg,
            }];
          }
        },
        ) as [string, IPackagedItem][]);
      } else {
        return null;
      }
    },
    reverse: (input?: Map<string, IPackagedItem>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(i => i.toJS() as IPackagedItemInit);
      } else {
        return null;
      }
    },
  },
};

// tslint:disable-next-line:variable-name
const PackageStorage = Record(DefaultPackage);

export class Package extends Persistent<IPackageInit, IPackageStore, IModelContext> implements IPackage {
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

  protected transform(input: Partial<IPackageInit>): IPackageStore {
    const result: IPackageStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'items') {
            result.items = PackageTransform.items.transform(input.items, this);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(input: Record<IPackageStore> & Readonly<IPackageStore>): IPackageInit {
    const result: IPackageInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'items') {
            result.items = PackageTransform.items.reverse(input.items);
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }

  constructor(init: Partial<IPackageInit>, context: IModelContext) {
    super();
    if (!context && init.items) {
      throw new Error('context must be provided');
    }
    this.attach(context);
    this.store = new PackageStorage(this.transform(init));
    this.init = new (Record<Partial<IPackageInit>>(init))();
  }
}
