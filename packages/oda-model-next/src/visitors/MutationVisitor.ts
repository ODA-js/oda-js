import { IVisitor } from '../interfaces/IVisitor';
import { IMutation, IMutationStore, IMutationInit } from '../interfaces/IMutation';
import { IEntityContext } from '../contexts/IEntityContext';
import { Validator } from '../validators/Validator';
import { MutationContext } from '../contexts/MutationContext';
import { IValidationContext } from '../contexts/IValidationContext';

export class MutationVisitor implements IVisitor<IMutation, IEntityContext> {
  public validator: Validator;
  public context: IEntityContext& IValidationContext; // has to be parent context
  public visit(item: IMutation) {
    const context = new MutationContext(this.context, item);
    const result = [];
    if (context.isValid) {
      let done = false;
      while (!done) {
        try {
          const rules = this.validator.getRules('field');
          rules.forEach(rule => result.push(...rule.validate(context)));
          done = true;
        } catch (err) {
          if (err.message !== 'mutation' ) {
            throw err;
          }
        }
      }
    } else {
      result.push({
        message: 'Validation context invalid',
        result: 'error',
      });
    }
    return result.map(r => ({
      ...r,
      mutation: context.mutation.name,
    }));
  }

  constructor(validator: Validator, pkg: IEntityContext& IValidationContext) {
    this.validator = validator;
    this.context = pkg;
  }
}
