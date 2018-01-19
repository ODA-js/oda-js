import { IModel } from '../interfaces/IModel';
import { IModelContext } from '../interfaces/IModelContext';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from '../interfaces/IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';

export class PackageContext implements IPackageContext {
  public name: string;
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IModelContext, pkg: IPackage) {
    this.model = context.model;
    this.package = pkg;
    this.errors = [];
  }
  public get isValid() {
    return !!(this.model && this.package);
  }

  public restart(level: RestartType) {
    restart('package');
  }
}
