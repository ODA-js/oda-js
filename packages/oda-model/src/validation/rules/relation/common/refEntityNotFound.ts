import { IValidationResult } from '../../../interfaces/IValidationResult';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-entity-not-found';
  public description = 'referenced entity not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.entities.get(context.relation.ref.entity);
    if (!entity) {
      result.push({
        message: this.description,
        result: 'error',
      });
    }
    return result;
  }
}
