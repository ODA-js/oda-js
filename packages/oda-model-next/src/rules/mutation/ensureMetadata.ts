import { IMutationContext } from '../../contexts/IMutationContext';
import { Rule } from '../../rule';
import { IValidationResult } from '../../interfaces/IValidationResult';

export default class implements Rule<IMutationContext> {
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
