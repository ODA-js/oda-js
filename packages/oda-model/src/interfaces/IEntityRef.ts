import { IUpdatable } from './IUpdatable';

export interface IEntityRefInit {
  backField?: string;
  entity: string;
  field?: string;
}

export interface IEntityRefStore {
  backField?: string;
  entity: string;
  field?: string;
}

export interface IEntityRef extends IUpdatable {
  readonly backField?: string;
  readonly entity: string;
  readonly field?: string;
}
