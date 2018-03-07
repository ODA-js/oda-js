import { IVisitor } from '../interfaces/IVisitor';
import { IPackage, IPackageInit, IPackageStore } from '../interfaces/IPackage';
import { IModelContext } from '../contexts/IModelContext';
import { Validator } from '../validators/Validator';
import { ModelContext } from '../contexts/ModelContext';
import { PackageContext } from '../contexts/PackageContext';
import { IValidationContext } from '../contexts/IValidationContext';

export class PackageVisitor implements IVisitor<IPackage, IModelContext> {
  public validator: Validator;
  public context: IModelContext & IValidationContext; // has to be parent context
  public visit(item: IPackage) {
    if (!this.context) {
      this.context = new ModelContext(item.context.model);
    }
    const context = new PackageContext(this.context, item);
    const result = [];
    if (context.isValid) {
      let done = false;
      while (!done) {
        try {
          const rules = this.validator.getRules('package');
          rules.forEach(rule => result.push(...rule.validate(context)));
          item.items.forEach(p => {
            result.push(... this.validator.check(p, { package: context }));
          });
          done = true;
        } catch (err) {
          if (err.message !== 'package') {
            throw err;
          }
        }
      }
    } else {
      result.push({
        package: context.package.name,
        message: 'Validation context invalid',
        result: 'error',
      });
    }
    return result.map(r => ({
      ...r,
      package: context.package.name,
    }));
  }

  constructor(validator: Validator, model?: IModelContext & IValidationContext) {
    this.validator = validator;
    this.context = model;
  }
}
