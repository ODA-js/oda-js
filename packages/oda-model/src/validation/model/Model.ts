import { Map, Record } from 'immutable';

import {
  IModel,
  IModelProps,
  IModelPropsStore,
  IModelTransform,
} from '../interfaces/IModel';
import { IPackage } from '../interfaces/IPackage';
import { Persistent } from './Persistent';
import { transformMap } from './utils';

// tslint:disable-next-line:variable-name
export const DefaultModel: IModelPropsStore = {
  name: null,
  title: null,
  description: null,
  packages: Map<string, IPackage>(),
};

// tslint:disable-next-line:variable-name
export const ModelTransform: IModelTransform = {
  packages: transformMap<IPackage>(),
};

// tslint:disable-next-line:variable-name
export const ModelStorage = Record(DefaultModel);

export class Model extends Persistent<IModelProps, IModelPropsStore> implements IModel {
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

  protected transform(input: IModelProps): IModelPropsStore {
    return {
      ...input,
      packages: ModelTransform.packages.transform(input.packages),
    };
  }
  protected reverse(input: IModelPropsStore): IModelProps {
    return {
      ...input,
      packages: ModelTransform.packages.reverse(input.packages),
    };
  }
  constructor(init: IModelProps) {
    super();
    this.store = new ModelStorage(this.transform(init));
    this.init = new (Record<IModelProps>(init))();
  }
}
