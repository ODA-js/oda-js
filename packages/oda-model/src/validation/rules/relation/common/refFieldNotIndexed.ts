import { IValidationResult } from '../../../../model/interfaces';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-field-not-indexed-fix';
  public description = 'referenced field not indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.entities.get(context.relation.ref.entity);
    if (entity) {
      let refField = entity.fields.get(context.relation.ref.field);
      if (refField && !refField.indexed) {
        const update = refField.toJSON();
        update.indexed = true;
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
