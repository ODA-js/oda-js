import { IValidationResult } from '../../../../model/interfaces';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-backFielnd-not-exists-fix';
  public description = 'back field not exists. fixed.';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.using.backField) {
      const bf = context.entity.fields.get(context.relation.using.backField);
      if (!bf) {
        context.relation.using.backField = 'id';
        result.push({
          message: this.description,
          result: 'fixable',
        });
      }
    }
    return result;
  }
}
