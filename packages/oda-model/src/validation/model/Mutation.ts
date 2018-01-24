import { Record } from 'immutable';
import { Map, Set } from 'immutable';

import { IFieldArgs } from '../interfaces/IField';
import { IMutation, IMutationACLStored, IMutationProps, IMutationPropsStored } from '../interfaces/IMutation';
import { Persistent } from './Persistent';
import { transformMap, transformSet } from './utils';

// tslint:disable-next-line:variable-name
export const DefaultMutation: IMutationPropsStored = {
  modelType: 'mutation',
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
export const MutationTransform: { [ k in keyof IMutationPropsStored]?: any } = {
  args: transformMap<IFieldArgs>(),
  payload: transformMap<IFieldArgs>(),
  acl: {
    execute: transformSet<string>(),
  },
};

// tslint:disable-next-line:variable-name
const MutationStorage = Record(DefaultMutation);

export class Mutation extends Persistent<IMutationProps, IMutationPropsStored> implements IMutation {
  public get modelType(): 'mutation' {
    return 'mutation';
  }
  public get name(): string {
    return this.store.get('name', null);
  }
  public get acl(): IMutationACLStored {
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

  protected transform(input: IMutationProps): IMutationPropsStored {
    return {
      ...input,
      args: MutationTransform.args.transform(input.payload),
      payload: MutationTransform.args.transform(input.payload),
      acl: {
        execute: MutationTransform.acl.execute.transform(input.acl.execute),
      },
    };
  }

  protected reverse(input: IMutationPropsStored): IMutationProps {
    return {
      ...input,
      args: MutationTransform.args.reverse(input.payload),
      payload: MutationTransform.args.reverse(input.payload),
      acl: {
        execute: MutationTransform.acl.execute.reverse(input.acl.execute),
      },
    };
  }

  constructor(init: IMutationProps) {
    super();
    this.store = new MutationStorage(this.transform(init));
    this.init = new (Record<IMutationProps>(init))();
  }
}