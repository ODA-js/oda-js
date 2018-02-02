import { IPackageContext } from './IPackageContext';
import { IEntity } from './IEntity';
import { RestartType } from './types';

export interface IEntityContext extends IPackageContext {
  readonly entity: IEntity;
  restart(level: RestartType);
}
