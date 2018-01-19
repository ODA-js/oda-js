import { IValidationResult } from '../../../../model/interfaces';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-not-supported-opposite';
  public description = 'relation has unsupported opposite';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.opposite) {
      const entity = context.package.entities.get(context.relation.ref.entity);
      if (entity && entity.fields.has(context.relation.opposite)) {
        const opposite = entity.fields.get(context.relation.opposite);
        if (!opposits[context.relation.verb][opposite.relation.verb]) {
          result.push({
            message: this.description,
            result: 'error',
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

