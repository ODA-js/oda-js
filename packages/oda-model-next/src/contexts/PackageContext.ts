import { IModel } from '../interfaces/IModel';
import { IModelContext } from './IModelContext';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from './IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { isIModelContext, isIPackageContext, isPackage } from '../helpers';
import { IValidationContext } from './IValidationContext';

export class PackageContext implements IPackageContext, IValidationContext {
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IModelContext & IValidationContext, pkg: IPackage) {
    if (isIModelContext(context)) {
      this.model = context.model;
      this.package = isPackage(pkg) && pkg;
      this.errors = [];
    }
  }
  public get isValid() {
    return !!(
      this.model
      && this.package
      && Array.isArray(this.errors)
    );
  }
  public restart(level: RestartType) {
    restart('package');
  }
}
