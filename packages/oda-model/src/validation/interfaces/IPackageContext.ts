import { IPackage } from './IPackage';
import { IModelContext } from './IModelContext';
import { RestartType } from './types';

export interface IPackageContext extends IModelContext {
  readonly package: IPackage;
  restart(level: RestartType);
}
