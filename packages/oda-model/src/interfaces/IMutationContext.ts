import { IPackageContext } from './IPackageContext';
import { IMutation } from './IMutation';
import { RestartType } from './types';

export interface IMutationContext extends IPackageContext {
  readonly mutation: IMutation;
  restart(level: RestartType);
}
