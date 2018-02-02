import { IPackageContext } from '../../contexts/IPackageContext';
import { IValidationResult } from '../../interfaces/IValidationResult';
import { Rule } from '../../rule';

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
