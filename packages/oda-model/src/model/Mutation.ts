import { Map, Record, Set } from 'immutable';

import { IFieldArgInit } from '../interfaces/IFieldArg';
import {
  IMutation,
  IMutationACLStore,
  IMutationACLTransform,
  IMutationInit,
  IMutationStore,
  IMutationTransform,
} from '../interfaces/IMutation';
import { IPackage } from '../interfaces/IPackage';
import { Persistent } from './Persistent';
import { TransformArgs } from './utils';
import { IPackageContext } from '../contexts/IPackageContext';

// tslint:disable-next-line:variable-name
export const DefaultMutation: IMutationStore = {
  name: null,
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

// tslint:disable-next-line:variable-name
export const MutationTransform: IMutationTransform = {
  args: TransformArgs(),
  payload: TransformArgs(),
  acl: MutationACLTransform,
};

// tslint:disable-next-line:variable-name
const MutationStorage = Record(DefaultMutation);

export class Mutation extends Persistent<IMutationInit, IMutationStore, IPackageContext> implements IMutation {
  public get modelType(): 'mutation' {
    return 'mutation';
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
  public get args(): Map<string, IFieldArgInit> {
    return Map(this.store.get('args', null));
  }
  public get payload(): Map<string, IFieldArgInit> {
    return Map(this.store.get('payload', null));
  }

  protected transform(input: Partial<IMutationInit>): Partial<IMutationStore> {
    const result: IMutationStore = {} as any;
    if (input) {
      for (let f in input) {
        if (input.hasOwnProperty(f)) {
          if (f === 'args') {
            result.args = MutationTransform.args.transform(input.args, this);
          } else if (f === 'payload') {
            result.payload = MutationTransform.payload.transform(input.payload, this);
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

  protected reverse(input: Record<IMutationStore> & Readonly<IMutationStore>): IMutationInit {
    const result: IMutationInit = {} as any;
    if (input) {
      const core = input.toJS();
      for (let f in core) {
        if (core.hasOwnProperty(f)) {
          if (f === 'args') {
            result.args = MutationTransform.args.reverse(input.args);
          } else if (f === 'payload') {
            result.payload = MutationTransform.payload.reverse(input.payload);
          } else if (f === 'acl') {
            const acl = input.acl;
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

  constructor(init?: Partial<IMutationInit>, context?: IPackageContext) {
    super();
    if (!context && init && (init.payload || init.args)) {
      throw new Error('context must be provided');
    }
    if (context) {
      this.attach(context);
    }
    this.store = new MutationStorage(this.transform(init));
  }
}
