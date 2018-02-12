import { IUpdatable } from './IUpdatable';

export interface IEntityRef extends IUpdatable {
  backField?: string;
  entity: string;
  field?: string;
}
