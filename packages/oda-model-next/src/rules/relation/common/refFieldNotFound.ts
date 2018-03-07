import { IEntity } from '../../../interfaces/IEntity';
import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-field-not-found';
  public description = 'referenced field not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.items.get(context.relation.ref.entity) as IEntity;
    if (isEntity(entity)) {
      let refField = entity.fields.get(context.relation.ref.field);
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
