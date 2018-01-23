import { IValidationResult } from './IValidationResult';
import { IModelType, IModelTypeProps } from './IModelType';
import { IMutation } from './IMutation';
import { IEntity } from './IEntity';
import { IField } from './IField';
import { IModel } from './IModel';
import { Rule } from '../rule';
import { IPackageContext } from './IPackageContext';
import { ModelItem } from './types';
import { Map } from 'immutable';

export type IPackageProps = IModelTypeProps & {
  modelType: 'package';
  acl: number;
  abstract?: boolean;
  items: ModelItem[];
};

export type IPackagePropsStored = IModelTypeProps & {
  modelType: 'package';
  acl: number;
  abstract?: boolean;
  items: Map<string, ModelItem>;
  model: IModel;
};

export interface IPackage extends IModelType<IPackageProps, IPackagePropsStored> {
  readonly modelType: 'package';
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
