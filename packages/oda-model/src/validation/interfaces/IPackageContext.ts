import { IPackage } from './IPackage';
import { IModelContext } from './IModelContext';
import { RestartType } from './types';

export interface IPackageContext extends IModelContext {
  package: IPackage;
  restart(level: RestartType);
}
