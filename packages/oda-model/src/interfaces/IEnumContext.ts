import { IPackageContext } from './IPackageContext';
import { IEnum } from './IEnum';
import { RestartType } from './types';

export interface IEnumContext extends IPackageContext {
  readonly enum: IEnum;
  restart(level: RestartType);
}
