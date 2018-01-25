import { IEntity } from '../../../interfaces/IEntity';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity, IsBelongsToMany } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-possible-opposite';
  public description = 'relation-common-possible-opposite';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.relation.opposite) {
      const entity = context.package.items.get(context.relation.ref.entity) as IEntity;
      if (isEntity(entity)) {
        let opposites = Array.from(entity.fields.values())
          .filter(f => f.relation && (
            (f.relation.ref.entity === context.entity.name && f.relation.ref.field === context.field.name) ||
            (IsBelongsToMany(f.relation) && f.relation.using && IsBelongsToMany(context.relation) && context.relation.using
              && f.relation.using.entity === context.relation.using.entity)),
        );

        if (opposites.length > 2) {
          result.push({
            message: 'more than one possible opposite',
            result: 'error',
          });
        }

        if (opposites.length === 1) {
          context.relation.opposite = opposites[0].name;
          result.push({
            message: 'found one possible opposite. assigned.',
            result: 'fixable',
          });

        }

        if (opposites.length === 0) {
          result.push({
            message: 'no possible opposite',
            result: 'critics',
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

