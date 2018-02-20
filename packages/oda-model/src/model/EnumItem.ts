import { Map, Record } from 'immutable';

import { IEnum, IEnumInit, IEnumStore, IEnumTransform } from '../interfaces/IEnum';
import { Persistent } from './Persistent';
import { IEnumItem, IEnumItemInit } from '../interfaces/IEnumItem';
import { IEnumContext } from '../contexts/IEnumContext';

// tslint:disable-next-line:variable-name
export const DefaultEnumItem: IEnumItemInit = {
  name: null,
  title: null,
  description: null,
  type: null,
  value: null,
  context: null,
};

// tslint:disable-next-line:variable-name
export const EnumStorage = Record(DefaultEnumItem);

export class EnumItem extends Persistent<IEnumItemInit, IEnumItemInit> implements IEnumItem {
  public get modelType(): 'enumItem' {
    return 'enumItem';
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
  public get value(): string {
    return this.store.get('value', null);
  }
  public get context(): IEnumContext {
    return this.store.get('context', null);
  }
  protected transform(input: Partial<IEnumItemInit>): IEnumItemInit {
    const result: IEnumItemInit = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          result[f] = input[f];
        }
      }
    }
    return result;
  }
  protected reverse(input: Record<IEnumItemInit> & Readonly<IEnumItemInit>): IEnumItemInit {
    const result: IEnumItemInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          result[f] = core[f];
        }
      }
    }
    return result;
  }

  constructor(init: Partial<IEnumItemInit> = {}) {
    super();
    this.store = new EnumStorage(this.transform(init));
    this.init = new (Record<Partial<IEnumItemInit>>(init))();
  }
}
