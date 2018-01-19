import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { IEntity } from '../../../interfaces/IEntity';
import { isEntity } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-using-field-not-found';
  public description = 'using field not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.items.get(context.relation.using.entity) as IEntity;
    if (isEntity(entity)) {
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
