import { IValidationResult, ValidationResultType } from '../../../../interfaces';
import { IFieldContext, IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';
import { connect } from 'http2';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-opposite-not-found';
  public description = 'opposite field not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.opposite) {
      const entity = context.package.entities.get(context.relation.ref.entity);
      if (entity && !entity.fields.has(context.relation.opposite)) {
        const update = context.relation.toObject();
        delete update.opposite;
        (context.relation).updateWith(update);
        result.push({
          message: this.description,
          result: ValidationResultType.fixable,
        });
      }
    }
    return result;
  }
}

const opposits = {
  BelongsTo: {
    HasOne: true,
    HasMany: true,
  },
  BelongsToMany: {
    BelongsToMany: true,
  },
  HasMany: {
    BelongsTo: true,
  },
  HasOne: {
    BelongsTo: true,
  },
};

