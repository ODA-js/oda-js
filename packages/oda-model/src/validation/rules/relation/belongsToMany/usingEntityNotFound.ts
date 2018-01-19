import { IValidationResult } from '../../../interfaces/IValidationResult';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-using-entity-not-found';
  public description = 'using entity not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.using) {
      const entity = context.package.entities.get(context.relation.using.entity);
      if (!entity) {
        const sysEntity = context.model.packages.get('system')
          .entities.get(context.relation.using.entity);
        if (sysEntity) {
          (<ModelPackage>context.package).addEntity((<Entity>sysEntity));
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
