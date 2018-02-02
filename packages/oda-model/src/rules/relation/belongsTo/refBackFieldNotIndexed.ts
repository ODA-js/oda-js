import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-belongsTo-ref-backFielnd-not-indexed-fix';
  public description = 'back field not indexed. fixed.';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.ref.backField) {
      const bf = context.entity.fields.get(context.relation.ref.backField);
      if (bf && !bf.indexed) {
        bf.updateWith({indexed: true});
        result.push({
          message: this.description,
          result: 'error',
        });
      }
    }
    return result;
  }
}
