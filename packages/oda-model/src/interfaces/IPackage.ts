import { Map } from 'immutable';

import { IPackageContext } from '../contexts/IPackageContext';
import { ArrayToMap } from '../model/utils';
import { Rule } from '../rule';
import { IModel } from './IModel';
import { IModelType, INamedItem } from './IModelType';
import { IPackagedItem, IPackagedItemInit, PackagedItemInit } from './IPackagedItem';
import { IValidationResult } from './IValidationResult';
import { IModelContext } from '../contexts/IModelContext';
import { IContextable } from '../contexts/IContextable';

export interface IPackageInit extends INamedItem {
  acl: number;
  abstract?: boolean;
  items: PackagedItemInit[];
}

export interface IPackageStore extends INamedItem {
  acl: number;
  abstract?: boolean;
  items: Map<string, IPackagedItem>;
  context: IModelContext;
}

export interface IPackageTransform {
  items: {
      transform: (inp: PackagedItemInit[], pkg: IPackage) => Map<string, IPackagedItem>,
      reverse: (inp: Map<string, IPackagedItem> ) => IPackagedItemInit[],
  };
}

export interface IPackage extends IModelType, IContextable<IModelContext> {
  readonly modelType: 'package';
  readonly acl: number;
  readonly abstract: boolean;
  readonly items: Map<string, IPackagedItem>;
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
