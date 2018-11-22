import { IsBelongsToMany } from '../../../helpers';
import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { IBelongsToMany } from '../../../interfaces/IBelongsToMany';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-backFielnd-is-not-identity-fix';
  public description = 'back field is not identity. fixed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (IsBelongsToMany(context.relation) && context.relation.using.backField) {
      const bf = context.entity.fields.get(context.relation.using.backField);
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
