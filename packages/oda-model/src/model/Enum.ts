import { Record } from 'immutable';
import { Map } from 'immutable';

import { IEnumStore, IEnumTransform, IEnumItem, IEnumInit, IEnum, EnumInitItem } from '../interfaces/IEnum';
import { transformMap } from './utils';
import { Persistent } from './Persistent';
import { } from './interfaces/IEnum';
import { IFieldStore } from '../interfaces/IField';

// tslint:disable-next-line:variable-name
export const DefaultEnum: Partial<IEnumStore> = {
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
          return [p, {
            value: p,
          }];
        } else {
          return [p, p];
        }
      }) as [string, IEnumItem][]);
    },
    reverse: (input: Map<string, IEnumItem>) => Array.from(input.values()[Symbol.iterator]()),
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
  protected reverse(input: IEnumStore): IEnumInit {
    const result: IEnumInit = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'values') {
            result.values = EnumTransform.values.reverse(input.values);
          } else {
            result[f] = input[f];
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
