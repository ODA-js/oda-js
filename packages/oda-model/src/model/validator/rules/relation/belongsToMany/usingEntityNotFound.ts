import { IValidationResult, ValidationResultType } from '../../../../interfaces';
import { IFieldContext, IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-using-entity-not-found';
  public description = 'using entity not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.using) {
      const entity = context.package.entities.get(context.relation.using.entity);
      if (!entity) {
        result.push({
          message: this.description,
          result: ValidationResultType.error,
        });
      }
    }
    return result;
  }
}
