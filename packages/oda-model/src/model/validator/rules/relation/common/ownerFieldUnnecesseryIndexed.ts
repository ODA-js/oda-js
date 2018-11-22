import { Field, Entity } from '../../../../index';
import { IValidationResult } from '../../../../interfaces';
import { IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-owner-field-unnecessery-indexed-fix';
  public description = 'owner relation field is unnecessery indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (!!context.field.identity || !!context.field.indexed) {
      const update = (<Field>context.field).toJSON();
      delete update.identity;
      delete update.indexed;
      delete update.metadata.storage.identity;
      delete update.metadata.storage.indexed;
      delete update.metadata.storage.required;
      update.entity = context.entity.name;
      (<Field>context.field).updateWith(update);
      (<Entity>context.entity).ensureIndexes();
      result.push({
        message: this.description,
        result: 'fixable',
      });
    }
    return result;
  }
}
