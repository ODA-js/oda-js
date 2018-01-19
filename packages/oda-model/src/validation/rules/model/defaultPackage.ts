import { IValidationResult } from '../../interfaces/IValidationResult';
import { IModelContext } from '../../interfaces/IModelContext';
import { Rule } from '../../rule';

export default class implements Rule<IModelContext> {
  public name = 'model-no-default-package';
  public description = 'model have default package';
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
