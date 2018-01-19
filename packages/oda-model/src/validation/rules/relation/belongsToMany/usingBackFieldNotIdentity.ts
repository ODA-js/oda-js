import { IValidationResult } from '../../../../model/interfaces';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-backFielnd-is-not-identity-fix';
  public description = 'back field is not identity. fixed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.using.backField) {
      const bf = context.entity.fields.get(context.relation.using.backField);
      if (bf && !bf.identity) {
        const update = bf.toJSON();
        update.identity = true;
        bf.updateWith(update);
        result.push({
          message: this.description,
          result: 'fixable',
        });
      }
    }
    return result;
  }
}
