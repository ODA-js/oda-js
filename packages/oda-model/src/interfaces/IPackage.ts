import { Map } from 'immutable';

import { ArrayToMap } from '../model/utils';
import { Rule } from '../rule';
import { IModel } from './IModel';
import { IModelType, INamedItem } from './IModelType';
import { IPackageContext } from './IPackageContext';
import { IPackagedItem } from './IPackagedItem';
import { IValidationResult } from './IValidationResult';

export interface IPackageInit extends Partial<INamedItem> {
  acl: number;
  abstract?: boolean;
  items: IPackagedItem[];
  model?: IModel;
}

export interface IPackageStore extends INamedItem {
  acl: number;
  abstract?: boolean;
  items: Map<string, IPackagedItem>;
  model: IModel;
}

export interface IPackageTransform {
  items: ArrayToMap<IPackagedItem>;
}

export interface IPackage extends IModelType {
  readonly modelType: 'package';
  readonly acl: number;
  readonly abstract?: boolean;
  readonly items: Map<string, IPackagedItem>;
  readonly model: IModel;
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
