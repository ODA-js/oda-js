import { IValidationResult, ValidationResultType } from '../../../interfaces';
import { IPackageContext } from '../../interfaces';
import { Rule } from '../../rules';

export default class implements Rule<IPackageContext> {
  public name = 'package-empty-name';
  public description = 'package must be named';
  public validate(context: IPackageContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.model.name) {
      result.push({
        message: this.description,
        result: ValidationResultType.error,
      });
    }
    return result;
  }
}
