import { IEntityInit } from './IEntity';
import { IMutationInit } from './IMutation';

export interface IModelHook {
  name: string;
  entities?: {
    [eName: string]: IEntityInit,
  };
  mutations?: {
    [mName: string]: IMutationInit;
  };
}
