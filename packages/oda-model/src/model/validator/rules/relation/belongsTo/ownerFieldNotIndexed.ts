import { IValidationResult, ValidationResultType } from '../../../../interfaces';
import { IFieldContext, IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';
import { Field } from '../../../../index';

export default class implements Rule<IRelationContext> {
  public name = 'relation-belongsTo-owner-field-is-not-indexed';
  public description = 'owner field is not indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!context.relation.ref.backField && !context.field.indexed) {
      const update = (<Field>context.field).toJSON();
      update.indexed = true;
      (<Field>context.field).updateWith(update);
      result.push({
        message: this.description,
        result: ValidationResultType.fixable,
      });
    }
    return result;
  }
}
