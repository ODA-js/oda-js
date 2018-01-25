import { IVisitor } from '../interfaces/IVisitor';
import { IEntity, IEntityProps, IEntityPropsStore} from '../interfaces/IEntity';
import { IPackageContext } from '../interfaces/IPackageContext';
import { Validator } from '../validators/Validator';
import { EntityContext } from '../contexts/EntityContext';
import { EntityLevel } from '../errors';

export class EntityVisitor implements IVisitor<IEntityProps, IEntityPropsStore, IEntity, IPackageContext> {
  public validator: Validator;
  public context: IPackageContext; // has to be parent context
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
          if (!(err instanceof EntityLevel)) {
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

  constructor(validator: Validator, pkg: IPackageContext) {
    this.validator = validator;
    this.context = pkg;
  }

}
