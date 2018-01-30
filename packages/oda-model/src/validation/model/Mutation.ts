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
  execute: transformSet<string>(),
};

// tslint:disable-next-line:variable-name
export const MutationTransform: IMutationTransform = {
  args: transformMap<IFieldArgs>(),
  payload: transformMap<IFieldArgs>(),
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
    return this.store.get('args', null);
  }
  public get payload(): Map<string, IFieldArgs> {
    return this.store.get('payload', null);
  }

  protected transform(input: IMutationInit): IMutationStore {
    return input && {
      ...input,
      package: null,
      args: input.args && MutationTransform.args.transform(input.args),
      payload: input.payload && MutationTransform.args.transform(input.payload),
      acl: input.acl && {
        execute: input.acl.execute && MutationTransform.acl.execute.transform(input.acl.execute),
      },
    };
  }

  protected reverse(input: IMutationStore): IMutationInit {
    return input && {
      ...input,
      args: input.args && MutationTransform.args.reverse(input.args),
      payload: input.payload && MutationTransform.args.reverse(input.payload),
      acl: input.acl && {
        execute: input.acl.execute && MutationTransform.acl.execute.reverse(input.acl.execute),
      },
    };
  }

  constructor(init: IMutationInit) {
    super();
    this.store = new MutationStorage(this.transform(init));
    this.init = new (Record<IMutationInit>(init))();
  }
}
