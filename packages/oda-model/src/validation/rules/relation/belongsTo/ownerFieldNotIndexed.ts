import { IValidationResult } from '../../../interfaces/IValidationResult';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-belongsTo-owner-field-is-not-indexed';
  public description = 'owner field is not indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.relation.ref.backField && !context.field.indexed) {
      const update = context.field;
      update.indexed = true;
      (context.field).updateWith(update);
      result.push({
        message: this.description,
        result: 'fixable',
      });
    }
    return result;
  }
}
