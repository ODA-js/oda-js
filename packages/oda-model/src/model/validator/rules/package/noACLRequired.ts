import { IValidationResult } from '../../../interfaces';
import { IPackageContext } from '../../interfaces';
import { Rule } from '../../rules';

export default class implements Rule<IPackageContext> {
  public name = 'package-not necessery-acl';
  public description = 'for this type of project acl not required';
  public validate(context: IPackageContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (typeof context.package.acl === 'number' && context.package.abstract) {
      result.push({
        message: this.description,
        result: 'critics',
      });
    }
    return result;
  }
}
