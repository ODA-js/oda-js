import { IValidationResult, ValidationResultType } from '../../../../interfaces';
import { IFieldContext, IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';
import { connect } from 'http2';
import { BelongsToMany } from '../../../../belongstomany';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-possible-opposite';
  public description = 'relation-common-possible-opposite';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.relation.opposite) {
      const entity = context.package.entities.get(context.relation.ref.entity);
      if (entity) {
        let opposites = Array.from(entity.fields.values())
          .filter(f => f.relation && (
            (f.relation.ref.entity === context.entity.name && f.relation.ref.field === context.field.name) ||
            ((f.relation as BelongsToMany).using && (this as any).using
              && (f.relation as BelongsToMany).using.entity === (this as any).using.entity)),
        );

        if (opposites.length > 2) {
          result.push({
            message: 'more than one possible opposite',
            result: ValidationResultType.error,
          });
        }

        if (opposites.length === 1) {
          context.relation.opposite = opposites[0].name;
          result.push({
            message: 'found one possible opposite. assigned.',
            result: ValidationResultType.fixable,
          });

        }

        if (opposites.length === 0) {
          result.push({
            message: 'no possible opposite',
            result: ValidationResultType.critics,
          });
        }
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

