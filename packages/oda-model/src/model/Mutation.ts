import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { IFieldArgs } from '../interfaces/IField';
import {
  IMutation,
  IMutationACLStore,
  IMutationInit,
  IMutationStore,
  IMutationTransform,
  IMutationACLTransform,
} from '../interfaces/IMutation';
import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';
import { IPackage } from '../interfaces/IPackage';

// tslint:disable-next-line:variable-name
export const DefaultMutation: IMutationStore = {
  name: null,
  package: null,
  title: null,
  description: null,
  args: null,
  payload: null,
  acl: {
    execute: Set<string>(),
  },
};

// tslint:disable-next-line:variable-name
export const MutationACLTransform: IMutationACLTransform = {
  execute: {
    transform: (input: string[]) => Set<string>(input),
    reverse: (input: Set<string> | string[]) => {
      if (Array.isArray(input)) {
        return input;
      } else {
        return Array.from(input.values()[Symbol.iterator]());
      }
    },
  },
};

let transformFieldArgs = {
  transform: (input: Partial<IFieldArgs>[]) => {
    return Map<string, IFieldArgs>(input.map(p => [p.name, p]) as [string, IFieldArgs][]);
  },
  reverse: (input: Map<string, IFieldArgs>) => {
    return Array.from(input.values()[Symbol.iterator]());
  },
};

// tslint:disable-next-line:variable-name
export const MutationTransform: IMutationTransform = {
  args: transformFieldArgs,
  payload: transformFieldArgs,
  acl: MutationACLTransform,
};

// tslint:disable-next-line:variable-name
const MutationStorage = Record(DefaultMutation);

export class Mutation extends Persistent<IMutationInit, IMutationStore> implements IMutation {
  public get modelType(): 'mutation' {
    return 'mutation';
  }
  public get package(): IPackage {
    return this.store.get('package', null);
  }
  public get name(): string {
    return this.store.get('name', null);
  }
  public get acl(): IMutationACLStore {
    return this.store.get('acl', null);
  }
  public get description(): string {
    return this.store.get('description', null);
  }
  public get title(): string {
    return this.store.get('title', null);
  }
  public get args(): Map<string, IFieldArgs> {
    return Map(this.store.get('args', null));
  }
  public get payload(): Map<string, IFieldArgs> {
    return Map(this.store.get('payload', null));
  }

  protected transform(input: Partial<IMutationInit>): Partial<IMutationStore> {
    const result: IMutationStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'args') {
            result.args = MutationTransform.args.transform(input.args);
          } else if (f === 'payload') {
            result.payload = MutationTransform.payload.transform(input.payload);
          } else if (f === 'acl') {
            for (let facl in input.acl) {
              if (input.acl.hasOwnProperty(facl)) {
                result.acl = {} as any;
                if (facl === 'execute') {
                  result.acl.execute = MutationTransform.acl.execute.transform(input.acl.execute);
                } else {
                  result[facl] = input[f];
                }
              }
            }
          } else {
            result[f] = input[f];
          }
        }
      }
    }
    return result;
  }

  protected reverse(input: Record<IMutationStore>): IMutationInit {
    const result: IMutationInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'args') {
            result.args = MutationTransform.args.reverse(input.get(f, null));
          } else if (f === 'payload') {
            result.payload = MutationTransform.payload.reverse(input.get(f, null));
          } else if (f === 'acl') {
            const acl = input.get(f, null);
            for (let facl in acl) {
              if (acl.hasOwnProperty(facl)) {
                result.acl = {} as any;
                if (facl === 'execute') {
                  result.acl.execute = MutationTransform.acl.execute.reverse(acl.execute);
                } else {
                  result.acl[facl] = core.acl[facl];
                }
              }
            }
          } else {
            result[f] = core[f];
          }
        }
      }
    }
    return result;
  }

  public toJS(): Partial<IMutationInit> {
    debugger;
    let result = this.reverse(this.store);
    return result;
  }
  constructor(init: Partial<IMutationInit> = {}) {
    super();
    this.store = new MutationStorage(this.transform(init));
    this.init = new (Record<Partial<IMutationInit>>(init))();
  }
}
