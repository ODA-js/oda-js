import { IValidationResult } from '../../interfaces/IValidationResult';
import { IModelContext } from '../../interfaces/IModelContext';
import { Rule } from '../../rule';

export default class implements Rule<IModelContext> {
  public name = 'model-empty-name';
  public description = 'model must be named';
  public validate(context: IModelContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.model.name) {
      result.push({
        message: this.description,
        result: 'error',
      });
    }
    return result;
  }
}
