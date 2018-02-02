import { IPackage } from '../interfaces/IPackage';
import { IModelContext } from './IModelContext';
import { RestartType } from '../interfaces/types';

export interface IPackageContext extends IModelContext {
  readonly package: IPackage;
  restart(level: RestartType);
}
