import { IValidationResult, ValidationResultType } from '../../../../interfaces';
import { IFieldContext, IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-backFielnd-is-not-identity-fix';
  public description = 'back field is not identity. fixed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.ref.backField) {
      const bf = context.entity.fields.get(context.relation.ref.backField);
      if (bf && !bf.identity ) {
        const update = bf.toJSON();
        update.identity = true;
        bf.updateWith(update);
        result.push({
          message: this.description,
          result: ValidationResultType.fixable,
        });
      }
    }
    return result;
  }
}
