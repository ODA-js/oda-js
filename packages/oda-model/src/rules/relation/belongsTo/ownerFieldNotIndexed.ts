import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-belongsTo-owner-field-is-not-indexed';
  public description = 'owner field is not indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.relation.ref.backField && !context.field.indexed) {
      (context.field).updateWith({indexed: true});
      result.push({
        message: this.description,
        result: 'fixable',
      });
    }
    return result;
  }
}
