import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-owner-field-unnecessery-indexed-fix';
  public description = 'owner relation field is unnecessery indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!!context.field.identity || !!context.field.indexed) {
      const update = context.field.toJSON();
      delete update.identity;
      delete update.indexed;
      context.field.updateWith(update);
      result.push({
        message: this.description,
        result: 'fixable',
      });
    }
    return result;
  }
}
