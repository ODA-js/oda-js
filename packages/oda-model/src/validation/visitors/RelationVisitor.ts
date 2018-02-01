import { IVisitor } from '../interfaces/IVisitor';
import { IRelation, IRelationInit, IRelationStore } from '../interfaces/IRelation';
import { IFieldContext } from '../interfaces/IFieldContext';
import { Validator } from '../validators/Validator';
import { RelationContext } from '../contexts/RelationContext';

export class RelationVisitor implements IVisitor<IRelation, IFieldContext> {
  public validator: Validator;
  public context: IFieldContext; // has to be parent context
  public visit(item: IRelation) {
    const context = new RelationContext(this.context, item);
    const result = [];
    if (context.isValid) {
      let done = false;
      while (!done) {
        try {
          const rules = this.validator.getRules('relation');
          rules.forEach(rule => result.push(...rule.validate(context)));
          switch (item.verb) {
            case 'BelongsTo': {
              const belongsTo = this.validator.getRules('BelongsTo');
              belongsTo.forEach(rule => result.push(...rule.validate(context)));
              break;
            }
            case 'BelongsToMany': {
              const belongsToMany = this.validator.getRules('BelongsToMany');
              belongsToMany.forEach(rule => result.push(...rule.validate(context)));
              break;
            }
            case 'HasOne': {
              const hasOne = this.validator.getRules('HasOne');
              hasOne.forEach(rule => result.push(...rule.validate(context)));
              break;
            }
            case 'HasMany': {
              const hasMany = this.validator.getRules('HasMany');
              hasMany.forEach(rule => result.push(...rule.validate(context)));
              break;
            }
            default:
          }
          done = true;
        } catch (err) {
          if (err.message !== 'relation') {
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
    return result;
  }

  constructor(validator: Validator, pkg: IFieldContext) {
    this.validator = validator;
    this.context = pkg;
  }
}
