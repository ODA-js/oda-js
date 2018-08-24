import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-backFielnd-is-not-identity-fix';
  public description = 'back field is not identity. fixed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.ref.backField) {
      const bf = context.entity.fields.get(context.relation.ref.backField);
      if (bf && !bf.identity) {
        bf.updateWith({ identity: true });
        result.push({
          message: this.description,
          result: 'fixable',
        });
      }
    }
    return result;
  }
}
