import { Map, Record } from 'immutable';

import { IModel, IModelInit, IModelStore, IModelTransform } from '../interfaces/IModel';
import { IPackage, IPackageInit } from '../interfaces/IPackage';
import { Package } from './Package';
import { Persistent } from './Persistent';

// tslint:disable-next-line:variable-name
export const DefaultModel: IModelStore = {
  name: null,
  title: null,
  description: null,
  packages: null,
};

// tslint:disable-next-line:variable-name
export const ModelTransform: IModelTransform = {
  packages: {
    transform: (input: IPackageInit[]) => {
      if (input) {
        return Map<string, IPackage>(input.map(p => [p.name, new Package(p)]) as [string, IPackage][]);
      } else {
        return null;
      }
    },
    reverse: (input?: Map<string, IPackage>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(f => f.toJS() as IPackageInit);
      } else {
        return null;
      }
    },
  },
};

// tslint:disable-next-line:variable-name
export const ModelStorage = Record(DefaultModel);

export class Model extends Persistent<IModelInit, IModelStore> implements IModel {
  public get modelType(): 'model' {
    return 'model';
  }
  public get name(): string {
    return this.store.get('name', null);
  }
  public get title(): string {
    return this.store.get('title', null);
  }
  public get description(): string {
    return this.store.get('description', null);
  }
  public get packages(): Map<string, IPackage> {
    return this.store.get('packages', null);
  }
  public get defaultPackage(): IPackage {
    return this._defaultPackage;
  }

  private _defaultPackage: IPackage;

  protected transform(input: Partial<IModelInit>): IModelStore {
    const result: IModelStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'packages') {
            result.packages = ModelTransform.packages.transform(input.packages);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(input: Record<IModelStore> & Readonly<IModelStore>): IModelInit {
    const result: IModelInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'packages') {
            result.packages = ModelTransform.packages.reverse(input.packages);
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }
  constructor(init: Partial<IModelInit> = {}) {
    super();
    this._defaultPackage = new Package({
      name: 'default',
      title: 'Default',
      description: 'default package',
    });
    this.store = new ModelStorage(this.transform(init));
    this.init = new (Record<Partial<IModelInit>>(init))();
  }
}
