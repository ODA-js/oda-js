import { IValidationResult } from '../../../interfaces/IValidationResult';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-owner-field-unnecessery-indexed-fix';
  public description = 'owner relation field is unnecessery indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!!context.field.identity || !!context.field.indexed) {
      const update = (<Field>context.field).toJSON();
      delete update.identity;
      delete update.indexed;
      (<Field>context.field).updateWith(update);
      result.push({
        message: this.description,
        result: 'fixable',
      });
    }
    return result;
  }
}
