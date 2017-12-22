import { IValidationResult, ValidationResultType } from '../../../../interfaces';
import { IFieldContext, IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';

export default class implements Rule<IRelationContext> {
  public name = 'relation-belongsTo-ref-backFielnd-is-identity';
  public description = 'back field is identity';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.ref.backField) {
      const bf = context.entity.fields.get(context.relation.ref.backField);
      if (bf && bf.identity && typeof bf.identity === 'boolean') {
        result.push({
          message: this.description,
          result: ValidationResultType.critics,
        });
        const update = bf.toJSON();
        update.indexed = true;
        bf.updateWith(update);
      }
    }
    return result;
  }
}
