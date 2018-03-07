import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity } from '../../../helpers';
import { IEntity } from '../../../interfaces/IEntity';
import { IRelationInit } from '../../../interfaces/IRelation';
import { IUpdatable } from '../../../interfaces/IUpdatable';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-opposite-not-found';
  public description = 'opposite field not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.opposite) {
      const entity = context.package.items.get(context.relation.ref.entity) as IEntity;
      if (isEntity(entity) && !entity.fields.has(context.relation.opposite)) {
        (context.relation as IUpdatable).updateWith({ opposite: null});
        result.push({
          message: this.description,
          result: 'fixable',
        });
      }
    }
    return result;
  }
}
