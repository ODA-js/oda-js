import { IVisitor } from '../interfaces/IVisitor';
import { IPackage, IPackageProps, IPackagePropsStore } from '../interfaces/IPackage';
import { IModelContext } from '../interfaces/IModelContext';
import { Validator } from '../validators/Validator';
import { ModelContext } from '../contexts/ModelContext';
import { PackageContext } from '../contexts/PackageContext';
import { PackageLevel } from '../errors';

export class PackageVisitor implements IVisitor<IPackageProps, IPackagePropsStore, IPackage, IModelContext> {
  public validator: Validator;
  public context: IModelContext; // has to be parent context
  public visit(item: IPackage) {
    if (!this.context) {
      this.context = new ModelContext(item.model);
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
          if (!(err instanceof PackageLevel)) {
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

  constructor(validator: Validator, model?: IModelContext) {
    this.validator = validator;
    this.context = model;
  }
}
