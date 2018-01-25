import { IMutation } from '../interfaces/IMutation';
import { IMutationContext } from '../interfaces/IMutationContext';
import { IModel } from '../interfaces/IModel';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from '../interfaces/IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';

export class MutationContext implements IMutationContext {
  public mutation: IMutation;
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IPackageContext, mutation: IMutation) {
    this.model = context.model;
    this.package = context.package;
    this.mutation = mutation;
    this.errors = [];
  }
  public get isValid() {
    return !!(this.model && this.package && this.mutation);
  }

  public restart(level: RestartType) {
    restart('mutation');
  }
}
