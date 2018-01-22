import { IModelType, IModelTypeProps } from './IModelType';
import { IValidationResult } from './IValidationResult';
import { IFieldArgs } from './IField';
import { Rule } from '../rule';
import { IMutationContext } from './IMutationContext';
import { IValidator } from './IValidator';
import { Record } from 'immutable';

export interface IMutationACL {
  readonly execute: string[];
}

export interface IMutationMetaData {
  readonly acl?: IMutationACL;
}

export type IMutationProps = IMutationMetaData & IModelTypeProps & {
  modelType: 'mutation';
  args: IFieldArgs[];
  payload: IFieldArgs[];
};

export interface IMutation extends IModelType<IMutationProps> {
  readonly modelType: 'mutation';
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
  public name: string = 'mutaion default acl';
  public description: string = 'set default acl to mutation';
  public validate(context: IMutationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.mutation.acl) {
      context.mutation.updateWith({
        acl: {
          execute: [],
        },
      });
      result.push({
        message: this.description,
        result: 'fixable',
      });
    }
    return result;
  }
}
