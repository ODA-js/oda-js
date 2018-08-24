import { IVisitor } from '../interfaces/IVisitor';
import { IEntity, IEntityInit, IEntityStore } from '../interfaces/IEntity';
import { IPackageContext } from '../contexts/IPackageContext';
import { Validator } from '../validators/Validator';
import { EntityContext } from '../contexts/EntityContext';
import { IValidationContext } from '../contexts/IValidationContext';

export class EntityVisitor implements IVisitor<IEntity, IPackageContext> {
  public validator: Validator;
  public context: IPackageContext & IValidationContext; // has to be parent context
  public visit(item: IEntity) {
    const context = new EntityContext(this.context, item);
    const result = [];
    if (context.isValid) {
      let done = false;
      while (!done) {
        try {
          const rules = this.validator.getRules('entity');
          rules.forEach(rule => result.push(...rule.validate(context)));
          item.fields.forEach(p => {
            result.push(...this.validator.check(p, { entity: context }));
          });
          done = true;
        } catch (err) {
          if (err.message !== 'entity') {
            throw err;
          }
        }
      }
    } else {
      result.push({
        entity: context.entity.name,
        message: 'Validation context invalid',
        result: 'error',
      });
    }
    return result.map(r => ({
      ...r,
      entity: context.entity.name,
    }));
  }

  constructor(validator: Validator, pkg: IPackageContext & IValidationContext) {
    this.validator = validator;
    this.context = pkg;
  }
}
