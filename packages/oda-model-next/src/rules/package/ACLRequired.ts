import { IPackageContext } from '../../contexts/IPackageContext';
import { IValidationResult } from '../../interfaces/IValidationResult';
import { Rule } from '../../rule';

export default class implements Rule<IPackageContext> {
  public name = 'package-acl-required-acl';
  public description = 'for this type of project acl is required';
  public validate(context: IPackageContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (typeof context.package.acl !== 'number' && !context.package.abstract) {
      result.push({
        message: this.description,
        result: 'error',
      });
    }
    return result;
  }
}
