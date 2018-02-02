import { IPackageContext } from './IPackageContext';
import { IEntity } from '../interfaces/IEntity';
import { RestartType } from '../interfaces/types';

export interface IEntityContext extends IPackageContext {
  readonly entity: IEntity;
  restart(level: RestartType);
}
