import { IValidationResult } from '../../../model/interfaces';
import { IPackageContext } from '../../interfaces/IPackageContext';
import { Rule } from '../../rule';

export default class implements Rule<IPackageContext> {
  public name = 'package-empty-name';
  public description = 'package must be named';
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
