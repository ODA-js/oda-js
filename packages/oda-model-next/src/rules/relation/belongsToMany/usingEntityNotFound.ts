import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { IEntity } from '../../../interfaces/IEntity';
import { isEntity, IsBelongsToMany } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-using-entity-not-found';
  public description = 'using entity not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (IsBelongsToMany(context.relation) && context.relation.using) {
      const entity = context.package.items.get(
        context.relation.using.entity,
      ) as IEntity;
      if (!isEntity(entity)) {
        const sysEntity = context.model.packages
          .get('system')
          .items.get(context.relation.using.entity) as IEntity;
        if (isEntity(sysEntity)) {
          context.package.updateWith({
            packages: [sysEntity],
          });
          result.push({
            message: 'using entity resolved from system package',
            result: 'fixable',
          });
        } else {
          result.push({
            message: this.description,
            result: 'error',
          });
        }
      }
    }
    return result;
  }
}
