import { IMutation } from '../interfaces/IMutation';
import { IMutationContext } from '../interfaces/IMutationContext';
import { IModel } from '../interfaces/IModel';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from '../interfaces/IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { isIPackageContext, isMutation } from '../helpers';

export class MutationContext implements IMutationContext {
  public mutation: IMutation;
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IPackageContext, mutation: IMutation) {
    if (isIPackageContext(context)) {
      this.model = context.model;
      this.package = context.package;
      this.mutation = isMutation(mutation) && mutation;
      this.errors = [];
    }
  }
  public get isValid() {
    return !!(
      this.model
      && this.package
      && this.mutation
      && Array.isArray(this.errors)
    );
  }
  public restart(level: RestartType) {
    restart('mutation');
  }
}
