import { IPackageContext } from './IPackageContext';
import { IMutation } from '../interfaces/IMutation';
import { RestartType } from '../interfaces/types';

export interface IMutationContext extends IPackageContext {
  readonly mutation: IMutation;
}
