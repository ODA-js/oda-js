import { Map, Record } from 'immutable';

import {  IEnum, IEnumInit,  IEnumStore, IEnumTransform } from '../interfaces/IEnum';
import { Persistent } from './Persistent';
import { EnumInitItem, IEnumItem } from '../interfaces/IEnumItem';
import { EnumItem } from './EnumItem';

// tslint:disable-next-line:variable-name
export const DefaultEnum: IEnumStore = {
  name: null,
  title: null,
  description: null,
  package: null,
  values: null,
};

// tslint:disable-next-line:variable-name
export const EnumTransform: IEnumTransform = {
  values: {
    transform: (input: EnumInitItem[] | {
      [name: string]: EnumInitItem;
    }) => {
      if (!Array.isArray(input)) {
        input = Object.keys(input).map(k => input[k]);
      }
      return Map<string, IEnumItem>(input.map(p => {
        if (typeof p === 'string') {
          return [p, new EnumItem({
            name: p,
          })];
        } else {
          return [p.name, new EnumItem(p)];
        }
      }) as [string, IEnumItem][]);
    },
    reverse: (input: Map<string, IEnumItem>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]());
      } else {
        return null;
      }
    },
  },
};

// tslint:disable-next-line:variable-name
export const EnumStorage = Record(DefaultEnum);

export class Enum extends Persistent<IEnumInit, IEnumStore> implements IEnum {
  public get modelType(): 'enum' {
    return 'enum';
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
  public get values(): Map<string, IEnumItem> {
    return this.store.get('values', null);
  }
  protected transform(input: Partial<IEnumInit>): IEnumStore {
    const result: IEnumStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'values') {
            result.values = EnumTransform.values.transform(input.values);
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }
  protected reverse(input: Record<IEnumStore> & Readonly<IEnumStore>): IEnumInit {
    const result: IEnumInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'values') {
            result.values = EnumTransform.values.reverse(input.values);
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }

  constructor(init: Partial<IEnumInit> = {}) {
    super();
    this.store = new EnumStorage(this.transform(init));
    this.init = new (Record<Partial<IEnumInit>>(init))();
  }
}
