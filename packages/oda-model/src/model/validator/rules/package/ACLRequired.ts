import { IValidationResult } from '../../../interfaces';
import { IPackageContext } from '../../interfaces';
import { Rule } from '../../rules';

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
