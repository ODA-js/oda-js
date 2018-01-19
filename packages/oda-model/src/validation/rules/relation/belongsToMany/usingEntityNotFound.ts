import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { IEntity } from '../../../interfaces/IEntity';
import { isEntity } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-using-entity-not-found';
  public description = 'using entity not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.using) {
      const entity = context.package.items.get(context.relation.using.entity) as IEntity;
      if (!isEntity(entity)) {
        const sysEntity = context.model.packages.get('system')
          .items.get(context.relation.using.entity)as IEntity;
        if (isEntity(sysEntity)) {
          context.package.addEntity(sysEntity);
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
