import { Map, Record } from 'immutable';

import { IEnum, IEnumInit, IEnumStore, IEnumTransform } from '../interfaces/IEnum';
import { Persistent } from './Persistent';
import { EnumInitItem, IEnumItem } from '../interfaces/IEnumItem';
import { EnumItem } from './EnumItem';
import { IPackageContext } from '../contexts/IPackageContext';
import { IEnumContext } from '../contexts/IEnumContext';
import { ModelFactory } from './Factory';

// tslint:disable-next-line:variable-name
export const DefaultEnum: IEnumStore = {
  name: null,
  title: null,
  description: null,
  values: null,
};

// tslint:disable-next-line:variable-name
export const EnumTransform: IEnumTransform = {
  values: {
    transform: (input: EnumInitItem[] | {
      [name: string]: EnumInitItem;
    }, en: IEnum) => {
      if (!Array.isArray(input)) {
        input = Object.keys(input).map(k => input[k]);
      }
      const context = ModelFactory.getContext(en) as IEnumContext;
      return Map<string, IEnumItem>(input.map(p => {
        if (typeof p === 'string') {
          return [p, new EnumItem({
            name: p,
          }, context)];
        } else {
          return [p.name, new EnumItem(p, context)];
        }
      }) as [string, IEnumItem][]);
    },
    reverse: (input: Map<string, IEnumItem>) => {
      if (input) {
        return Array.from(input.values()[Symbol.iterator]()).map(i => i.toJS() as IEnumItem);
      } else {
        return null;
      }
    },
  },
};

// tslint:disable-next-line:variable-name
export const EnumStorage = Record(DefaultEnum);

export class Enum extends Persistent<IEnumInit, IEnumStore, IPackageContext> implements IEnum {
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
      if (input instanceof Persistent) {
        input = input.toJS();
      }
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'values') {
            result.values = EnumTransform.values.transform(input.values, this);
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
          if (core[f] !== undefined && core[f] !== null) {
            if (f === 'values') {
              result.values = EnumTransform.values.reverse(input.values);
            } else {
              result[f] = core[f];
            }
          }
        }
      }
    }
    return result;
  }

  constructor(init?: Partial<IEnumInit>, context?: IPackageContext) {
    super();
    if (!context && init && init.values) {
      throw new Error('context must be provided');
    }
    if (context) {
      this.attach(context);
    }
    this.store = new EnumStorage(this.transform(init));
  }
}
