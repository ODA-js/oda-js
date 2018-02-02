import { IMutationContext } from '../../contexts/IMutationContext';
import { Rule } from '../../rule';
import { IValidationResult } from '../../interfaces/IValidationResult';

export default class implements Rule<IMutationContext> {
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
