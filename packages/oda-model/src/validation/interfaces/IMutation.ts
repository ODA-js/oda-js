import { Rule } from '../validator/rule';
import { IMutationContext } from '../validator/interfaces';
import { IModelType } from './IModelType';
import { IValidationResult } from './IValidationResult';
import { IFieldArgs } from './IField';

export interface IMutationACL {
  execute: string[];
}

export interface IMutationMetaData {
  acl?: IMutationACL;
}

export interface IMutation extends IModelType {
  modelType: 'mutation';
  metadata?: IMutationMetaData;
  args: IFieldArgs[];
  payload: IFieldArgs[];
}

export class CheckMutationName implements Rule<IMutationContext> {
  public name: string = 'mutation name is empty';
  public description: string = 'name for mutations must be set';
  public validate(context: IMutationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.mutation.name) {
      result.push({
        message: this.description,
        result: 'error',
      });
    }
    return result;
  }
}

export class EnsureMutationMetadata implements Rule<IMutationContext> {
  public name: string = 'mutation name is empty';
  public description: string = 'name for mutations must be set';
  public validate(context: IMutationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.mutation.metadata) {
      context.mutation.metadata = {
        acl: {
          execute: [],
        },
      };
      result.push({
        message: this.description,
        result: 'fixable',
      });
    }
    return result;
  }
}

