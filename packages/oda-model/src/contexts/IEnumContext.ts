import { IPackageContext } from './IPackageContext';
import { IEnum } from '../interfaces/IEnum';
import { RestartType } from '../interfaces/types';

export interface IEnumContext extends IPackageContext {
  readonly enum: IEnum;
  restart(level: RestartType);
}
