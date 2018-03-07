import { IEntity } from '../interfaces/IEntity';
import { IEntityContext } from './IEntityContext';
import { IModel } from '../interfaces/IModel';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from './IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { isIPackageContext, isEntity } from '../helpers';
import { IValidationContext } from './IValidationContext';

export class EntityContext implements IEntityContext, IValidationContext {
  public entity: IEntity;
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IPackageContext & IValidationContext, entity: IEntity) {
    if (isIPackageContext(context)) {
      this.package = context.package;
      this.model = context.model;
      this.entity = isEntity(entity) && entity;
      this.errors = [];
    }
  }
  public get isValid() {
    return !!(this.model
      && this.package
      && this.entity
      && Array.isArray(this.errors)
    );
  }
  public restart(level: RestartType) {
    restart('entity');
  }
}
