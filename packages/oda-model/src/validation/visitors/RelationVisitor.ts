import { IVisitor } from '../interfaces/IVisitor';
import { IRelation, IRelationProps, IRelationPropsStore } from '../interfaces/IRelation';
import { IFieldContext } from '../interfaces/IFieldContext';
import { Validator } from '../validators/Validator';
import { RelationContext } from '../contexts/RelationContext';
import { RelationLevel } from '../errors';
import { Relation } from '../interfaces/types';

export class RelationVisitor implements IVisitor<IRelationProps, IRelationPropsStore, Relation, IFieldContext> {
  public validator: Validator;
  public context: IFieldContext; // has to be parent context
  public visit(item: Relation) {
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
          if (!(err instanceof RelationLevel)) {
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
