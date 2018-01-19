import { IFieldContext } from '../../interfaces/IFieldContext';
import { IValidationResult } from '../../interfaces/IValidationResult';
import { Rule } from '../../rule';

export default class implements Rule<IFieldContext> {
  public name = 'field-empty-name';
  public description = 'field must be named';
  public validate(context: IFieldContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.field.name) {
      result.push({
        message: this.description,
        result: 'error',
      });
    }
    return result;
  }
}
