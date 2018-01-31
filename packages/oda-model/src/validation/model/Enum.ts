import { Record } from 'immutable';
import { Map } from 'immutable';

import { IEnumStore, IEnumTransform, IEnumItem, IEnumInit, IEnum } from '../interfaces/IEnum';
import { transformMap } from './utils';
import { Persistent } from './Persistent';
import { IFieldStore } from '../interfaces/IField';

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
  values: transformMap<IEnumItem>(),
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
  protected transform(input: IEnumInit): IEnumStore {
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
  constructor(init: IEnumInit) {
    super();
    this.store = new EnumStorage(this.transform(init));
    this.init = new (Record<IEnumInit>(init))();
  }
}
