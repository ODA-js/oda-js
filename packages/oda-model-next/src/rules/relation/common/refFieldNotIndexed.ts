import { IEntity } from '../../../interfaces/IEntity';
import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-field-not-indexed-fix';
  public description = 'referenced field not indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.items.get(
      context.relation.ref.entity,
    ) as IEntity;
    if (isEntity(entity)) {
      let refField = entity.fields.get(context.relation.ref.field);
      if (refField && !refField.indexed) {
        refField.updateWith({ indexed: true });
        result.push({
          message: this.description,
          result: 'fixable',
        });
      }
    }
    return result;
  }
}
