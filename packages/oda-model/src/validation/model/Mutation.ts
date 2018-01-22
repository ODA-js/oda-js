import { Record } from 'immutable';

import { IFieldArgs } from '../interfaces/IField';
import { IMutation, IMutationACL, IMutationProps } from '../interfaces/IMutation';
import { Persistent } from './Persistent';

export const defaultMutation: IMutationProps = {
  modelType: 'mutation',
  name: null,
  args: null,
  description: null,
  payload: null,
  title: null,
  acl: {
    execute: null,
  },
};

// tslint:disable-next-line:variable-name
const MutationStorage = Record(defaultMutation);

export class Mutation extends Persistent<IMutationProps> implements IMutation {
  public get modelType(): 'mutation' {
    return 'mutation';
  }
  public get name(): string {
    return this.store.get('name', null);
  }
  public get acl(): IMutationACL {
    return this.store.get('acl', null);
  }
  public get description(): string {
    return this.store.get('description', null);
  }
  public get title(): string {
    return this.store.get('title', null);
  }
  public get args(): IFieldArgs[] {
    return this.store.get('args', []);
  }
  public get payload(): IFieldArgs[] {
    return this.store.get('payload', []);
  }
  constructor(init: Partial<IMutationProps>) {
    super();
    this.store = new MutationStorage(init);
    this.init = new MutationStorage(init);
  }
}
