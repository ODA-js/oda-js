import { IModel } from '../interfaces/IModel';
import { IModelContext } from '../interfaces/IModelContext';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from '../interfaces/IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { isIModelContext, isIPackageContext, isPackage } from '../helpers';

export class PackageContext implements IPackageContext {
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IModelContext, pkg: IPackage) {
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
