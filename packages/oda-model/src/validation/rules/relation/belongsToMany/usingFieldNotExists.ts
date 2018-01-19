import { IValidationResult } from '../../../../model/interfaces';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-using-field-not-found';
  public description = 'using field not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.entities.get(context.relation.using.entity);
    if (entity) {
      let refField = entity.fields.get(context.relation.using.field);
      if (!refField) {
        result.push({
          message: this.description,
          result: 'error',
        });
      }
    }
    return result;
  }
}
