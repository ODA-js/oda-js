import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-belongsTo-owner-field-is-identity';
  public description = 'owner field is identity';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.relation.ref.backField
      && !!context.field.identity
      && typeof context.field.identity === 'boolean'
    ) {
      result.push({
        message: this.description,
        result: 'critics',
      });
    }
    return result;
  }
}
