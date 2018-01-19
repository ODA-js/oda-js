import { IEntity } from '../../../interfaces/IEntity';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-belongsTo-ref-field-not-identity-fix';
  public description = 'referenced field not identity';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.items.get(context.relation.ref.entity) as IEntity;
    if (isEntity(entity)) {
      let refField = entity.fields.get(context.relation.ref.field);
      if (refField && !refField.identity) {
        const update = refField.toJSON();
        update.identity = true;
        refField.updateWith(update);
        result.push({
          message: this.description,
          result: 'fixable',
        });
      }
    }
    return result;
  }
}
