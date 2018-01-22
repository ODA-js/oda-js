import { IValidationResult } from './IValidationResult';
import { IModelType } from './IModelType';
import { IMutation } from './IMutation';
import { IEntity } from './IEntity';
import { IField } from './IField';
import { IModel } from './IModel';
import { Rule } from '../rule';
import { IPackageContext } from './IPackageContext';

export interface IPackage extends IModelType {
  modelType: 'package';
  acl: number;
  abstract?: boolean;
  items: Map<string, IModelType>;
  model?: IModel;
}

export class CheckMutationName implements Rule<IPackageContext> {
  public name: string = 'mutation name is empty';
  public description: string = 'name for mutations must be set';
  public validate(context: IPackageContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.package.name) {
      result.push({
        message: this.description,
        result: 'error',
      });
    }
    return result;
  }
}
