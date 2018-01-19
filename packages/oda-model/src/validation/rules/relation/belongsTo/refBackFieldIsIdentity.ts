import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';

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
          result: 'critics',
        });
      }
    }
    return result;
  }
}
