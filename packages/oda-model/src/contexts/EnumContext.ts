import { IMutation } from '../interfaces/IMutation';
import { IMutationContext } from '../interfaces/IMutationContext';
import { IModel } from '../interfaces/IModel';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from '../interfaces/IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { IEnumContext } from '../interfaces/EnumContext';
import { IEnum } from '../interfaces/IEnum';
import { isIPackageContext, isEnum } from '../helpers';

export class EnumContext implements IEnumContext {
  public enum: IEnum;
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IPackageContext, iEnum: IEnum) {
    if (isIPackageContext(context)) {
      this.model = context.model;
      this.package = context.package;
      this.enum = isEnum(iEnum) && iEnum;
      this.errors = [];
    }
  }
  public get isValid() {
    return !!(
      this.model
      && this.package
      && this.enum
      && Array.isArray(this.errors)
    );
  }
  public restart(level: RestartType) {
    restart('mutation');
  }
}
