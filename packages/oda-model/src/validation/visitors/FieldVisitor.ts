import { IVisitor } from '../interfaces/IVisitor';
import { IField, IFieldStore, IFieldInit } from '../interfaces/IField';
import { IEntityContext } from '../interfaces/IEntityContext';
import { Validator } from '../validators/Validator';
import { FieldContext } from '../contexts/FieldContext';
import { FieldLevel } from '../errors';

export class FieldVisitor implements IVisitor<IField, IEntityContext> {
  public validator: Validator;
  public context: IEntityContext; // has to be parent context
  public visit(item: IField) {
    const context = new FieldContext(this.context, item);
    const result = [];
    if (context.isValid) {
      let done = false;
      while (!done) {
        try {
          const rules = this.validator.getRules('field');
          rules.forEach(rule => result.push(...rule.validate(context)));
          if (item.relation) {
            result.push(...this.validator.check(item.relation, { field: context }));
          }
          done = true;
        } catch (err) {
          if (!(err instanceof FieldLevel)) {
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
      field: context.field.name,
    }));
  }

  constructor(validator: Validator, pkg: IEntityContext) {
    this.validator = validator;
    this.context = pkg;
  }
}
