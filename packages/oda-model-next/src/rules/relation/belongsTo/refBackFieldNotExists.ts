import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-belongsTo-ref-backFielnd-not-exists-fix';
  public description = 'back field not exists. removed.';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.ref.backField) {
      const bf = context.entity.fields.get(context.relation.ref.backField);
      if (!bf) {
        context.relation.ref.updateWith({backField : ''});
        result.push({
          message: this.description,
          result: 'fixable',
        });
      }
    }
    return result;
  }
}
